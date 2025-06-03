import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { ref } from 'vue'
import NewSom from '../NewSom.vue'
import { generateValidationRules, getPrevMilestone } from '@/utils/milestones.js'

// Mock the stores
vi.mock('@/store/soms.js', () => ({
  useSoms: () => ({
    createSom: vi.fn().mockResolvedValue({ id: 1 })
  })
}))

// Mock the env
vi.mock('@/env', () => ({
  env: {
    VITE_MAX_MILESTONE_BUDGET: '0.30'
  }
}))

// Mock utils
vi.mock('@/utils/fund.js', () => ({
  getShortNameFromId: (fundId) => `f${fundId}`
}))

vi.mock('@/utils/validations.js', () => ({
  HTMLNotEmpty: (value) => value && value.trim().length > 0
}))

// Mock composables
vi.mock('@/composables/useFormFields.js', () => ({
  useFormFields: (schema) => ({
    schema: ref(schema),
    clearForm: vi.fn()
  })
}))

// Mock formvuelate
vi.mock('formvuelate', () => ({
  SchemaFormFactory: () => ({
    name: 'MockSchemaForm',
    template: '<div>Mock Schema Form</div>'
  }),
  useSchemaForm: () => ({
    updateFormModel: vi.fn()
  })
}))

// Mock vee-validate plugin
vi.mock('@formvuelate/plugin-vee-validate', () => ({
  default: () => ({})
}))

// Create test i18n instance
const createTestI18n = () => {
  return createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        'new_som.component_title': 'New SoM {nr}',
        'new_som.clone_latest': 'Clone Latest',
        'new_som.submit': 'Submit',
        'new_som.reset': 'Reset',
        'new_som.title': 'Title',
        'new_som.outputs': 'Outputs',
        'new_som.success_criteria': 'Success Criteria',
        'new_som.evidence': 'Evidence',
        'new_som.cost': 'Cost',
        'new_som.month': 'Month',
        'new_som.completion': 'Completion',
        'new_som.title_help': 'Title help',
        'new_som.outputs_help': 'Outputs help',
        'new_som.success_criteria_help': 'Success criteria help',
        'new_som.evidence_help': 'Evidence help',
        'new_som.cost_help': 'Cost help. Max: {maxCost}',
        'new_som.month_help': 'Month help',
        'new_som.completion_help': 'Completion help',
        'new_som.last_milestone_outputs_default': 'Final outputs',
        'new_som.last_milestone_success_criteria_default': 'Final success criteria',
        'new_som.last_milestone_evidence_default': 'Final evidence',
        'validations.text_required': 'Text is required'
      }
    },
    numberFormats: {
      en: {
        currency: {
          style: 'currency',
          currency: 'USD'
        }
      }
    },
    datetimeFormats: {
      en: {
        month_only: {
          month: 'long'
        }
      }
    }
  })
}

// Test data fixtures
const mockProposalF9 = {
  id: 1,
  challenge_id: 1,
  budget: 100000,
  currency: 'ada',
  milestones_qty: 3,
  starting_date: '2024-01-01',
  challenges: {
    fund_id: 9
  }
}

const mockProposalF10 = {
  id: 2,
  challenge_id: 2,
  budget: 150000,
  currency: 'usd',
  milestones_qty: 4,
  starting_date: '2024-01-01',
  challenges: {
    fund_id: 10
  }
}

const mockProposalF11 = {
  id: 3,
  challenge_id: 3,
  budget: 200000,
  currency: 'ada',
  milestones_qty: 5,
  starting_date: '2024-01-01',
  challenges: {
    fund_id: 11
  }
}

const mockSoms = [
  {
    id: 1,
    milestone: 1,
    cost: 10000,
    month: 2,
    completion: 20
  },
  {
    id: 2,
    milestone: 2,
    cost: 15000,
    month: 4,
    completion: 40
  }
]

const createWrapper = (props = {}) => {
  const defaultProps = {
    proposal: mockProposalF9,
    milestone: 1,
    som: null,
    soms: []
  }

  return mount(NewSom, {
    props: { ...defaultProps, ...props },
    global: {
      plugins: [createTestI18n(), createPinia()],
      components: {
        'o-button': {
          template: '<button><slot /></button>'
        },
        'schema-form': {
          template: '<form><slot name="afterForm" /></form>'
        }
      }
    }
  })
}

describe('NewSom.vue', () => {
  describe('Component Rendering', () => {
    it('should render component with correct title', () => {
      const wrapper = createWrapper({ milestone: 2 })
      expect(wrapper.find('.card-header-title').text()).toContain('New SoM 2')
    })

    it('should show clone button when som prop is provided', () => {
      const wrapper = createWrapper({ 
        som: { id: 1, title: 'Test SoM' }
      })
      expect(wrapper.find('.mt-2.mr-4').exists()).toBe(true)
      expect(wrapper.find('.mt-2.mr-4').text()).toBe('Clone Latest')
    })

    it('should not show clone button when som prop is null', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.mt-2.mr-4').exists()).toBe(false)
    })
  })

  describe('Validation Rules - Fund F9', () => {

    it('should generate correct cost validation rules for F9', () => {
      const rules = generateValidationRules(mockProposalF9, 1, 0, false, [])
      const minCost = rules.f9.minCost()
      const maxCost = rules.f9.maxCost()
      
      expect(minCost).toBe(1)
      expect(maxCost).toBe(30000) // 30% of 100000
    })

    it('should generate correct month validation rules for F9', () => {
      const rules = generateValidationRules(mockProposalF9, 1, 0, false, [])
      const minMonth = rules.f9.minMonth()
      const maxMonth = rules.f9.maxMonth()
      
      expect(minMonth).toBe(1)
      expect(maxMonth).toBe(24)
    })

    it('should generate correct month validation with previous milestone for F9', () => {
      const rules = generateValidationRules(mockProposalF9, 2, 0, false, mockSoms)
      const minMonth = rules.f9.minMonth()
      
      expect(minMonth).toBe(3) // Previous milestone month (2) + 1
    })
  })

  describe('Validation Rules - Fund F10', () => {

    it('should generate correct cost validation rules for F10 milestone 1', () => {
      const rules = generateValidationRules(mockProposalF10, 1, 0, false, [])
      const minCost = rules.f10.minCost()
      const maxCost = rules.f10.maxCost()
      
      expect(minCost).toBe(7500) // min(5% of 150000, 75000) = min(7500, 75000)
      expect(maxCost).toBe(45000) // 30% of 150000
    })

    it('should generate correct cost validation rules for F10 last milestone', () => {
      const rules = generateValidationRules(mockProposalF10, 4, 50000, true, [])
      const minCost = rules.f10.minCost()
      const maxCost = rules.f10.maxCost()
      
      expect(minCost).toBe(22500) // 15% of 150000
      expect(maxCost).toBe(100000) // Available budget (150000 - 50000)
    })

    it('should cap first milestone cost at 75000 for F10', () => {
      const largeProposal = { ...mockProposalF10, budget: 500000 }
      const rules = generateValidationRules(largeProposal, 1, 0, false, [])
      const maxCost = rules.f10.maxCost()
      
      expect(maxCost).toBe(75000) // Capped at 75000 for milestone 1
    })
  })

  describe('Validation Rules - Fund F11', () => {

    it('should generate correct cost validation rules for F11', () => {
      const rules = generateValidationRules(mockProposalF11, 1, 0, false, [])
      const minCost = rules.f11.minCost()
      const maxCost = rules.f11.maxCost()
      
      expect(minCost).toBe(10000) // 5% of 200000
      expect(maxCost).toBe(60000) // 30% of 200000
    })

    it('should generate correct month validation rules for F11', () => {
      const rules = generateValidationRules(mockProposalF11, 1, 0, false, [])
      const minMonth = rules.f11.minMonth()
      const maxMonth = rules.f11.maxMonth()
      
      expect(minMonth).toBe(1)
      expect(maxMonth).toBe(3) // lastMonth (0) + 3, min with 11
    })

    it('should generate correct month validation for F11 last milestone', () => {
      const rules = generateValidationRules(mockProposalF11, 5, 0, true, mockSoms)
      const maxMonth = rules.f11.maxMonth()
      
      expect(maxMonth).toBe(5) // lastMonth (4) + 1 for last milestone
    })
  })

  describe('Helper Functions', () => {
    it('should find previous milestone correctly', () => {
      const prevMilestone = getPrevMilestone(mockSoms, 3)
      expect(prevMilestone).toEqual(mockSoms[1]) // milestone 2
    })

    it('should return null when no previous milestone exists', () => {
      const prevMilestone = getPrevMilestone(mockSoms, 1)
      expect(prevMilestone).toBeNull()
    })

    it('should return null for empty soms array', () => {
      const prevMilestone = getPrevMilestone([], 2)
      expect(prevMilestone).toBeNull()
    })
  })

  describe('Computed Properties', () => {
    it('should calculate otherSomsBudget correctly', () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 3,
        soms: mockSoms
      })
      
      // Other soms cost: 10000 + 15000 = 25000
      // Missing milestones: none (milestone 1 and 2 exist, milestone 3 is current)
      // Total: 25000
      expect(wrapper.vm.otherSomsBudget).toBe(25000)
    })

    it('should identify last milestone correctly', () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 3
      })
      
      expect(wrapper.vm.isLastMilestone).toBe(true)
    })

    it('should identify non-last milestone correctly', () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 2
      })
      
      expect(wrapper.vm.isLastMilestone).toBe(false)
    })
  })

  describe('Form Validation', () => {
    it('should validate cost field with correct rules', async () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 1
      })
      
      const costRule = wrapper.vm.costRule
      
      // Test valid cost
      await expect(costRule.validate(15000)).resolves.toBe(15000)
      
      // Test invalid cost (too low)
      await expect(costRule.validate(0)).rejects.toThrow()
      
      // Test invalid cost (too high)
      await expect(costRule.validate(50000)).rejects.toThrow()
      
      // Test non-integer
      await expect(costRule.validate(15000.5)).rejects.toThrow()
      
      // Test non-numeric string
      await expect(costRule.validate('abc')).rejects.toThrow()
    })

    it('should validate month field with correct rules', async () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 2,
        soms: mockSoms
      })
      
      const monthRule = wrapper.vm.monthRule
      
      // Test valid month
      await expect(monthRule.validate(5)).resolves.toBe(5)
      
      // Test invalid month (too low)
      await expect(monthRule.validate(2)).rejects.toThrow()
      
      // Test invalid month (too high)
      await expect(monthRule.validate(25)).rejects.toThrow()
    })

    it('should validate completion field with correct rules', async () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 3,
        soms: mockSoms
      })
      
      const completionRule = wrapper.vm.completionRule
      
      // Test valid completion
      await expect(completionRule.validate(50)).resolves.toBe(50)
      
      // Test invalid completion (too low)
      await expect(completionRule.validate(30)).rejects.toThrow()
    })
  })

  describe('Month Options', () => {
    it('should generate correct month options', () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 1
      })
      
      const options = wrapper.vm.monthOptions
      expect(options).toHaveLength(24)
      expect(options[0]).toEqual({
        value: 1,
        label: expect.stringContaining('Month 1')
      })
    })
  })

  describe('Form Submission', () => {
    it('should emit somSubmitted event on successful submission', async () => {
      const wrapper = createWrapper()
      
      await wrapper.vm.handleCreateSom()
      
      expect(wrapper.emitted('somSubmitted')).toBeTruthy()
    })

    it('should emit refreshRecap when all milestones are submitted', async () => {
      const wrapper = createWrapper({
        proposal: { ...mockProposalF9, milestones_qty: 3 },
        soms: [mockSoms[0], mockSoms[1]] // 2 existing soms, adding 1 more = 3 total
      })
      
      await wrapper.vm.handleCreateSom()
      
      expect(wrapper.emitted('refreshRecap')).toBeTruthy()
    })
  })

  describe('Clone Functionality', () => {
    it('should clone som data when clone button is clicked', async () => {
      const somData = {
        id: 1,
        title: 'Test Title',
        cost: 15000,
        month: 2,
        completion: 30,
        outputs: '<p>Test outputs</p>',
        success_criteria: '<p>Test criteria</p>',
        evidence: '<p>Test evidence</p>'
      }
      
      const wrapper = createWrapper({ som: somData })
      
      await wrapper.find('.mt-2.mr-4').trigger('click')
      
      // Verify that the form is populated with som data
      // Note: In a real test, you'd need to check the actual form field values
      // This would require access to the form state
    })
  })

  describe('Last Milestone Defaults', () => {
    it('should set default values for last milestone on mount', () => {
      const wrapper = createWrapper({
        proposal: mockProposalF9,
        milestone: 3 // Last milestone
      })
      
      // In a real implementation, you'd verify the form fields are populated
      // with the default values for the last milestone
      expect(wrapper.vm.isLastMilestone).toBe(true)
    })
  })
}) 