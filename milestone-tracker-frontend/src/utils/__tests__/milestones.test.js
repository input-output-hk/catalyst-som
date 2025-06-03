import { describe, it, expect, vi } from 'vitest'
import {
  getPrevMilestone,
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment,
  canSubmitSomByChangeRequest,
  canAllSomsBeSignedOffByReviews,
  isPreviousSomSignedOff,
  isPreviousPoaSignedOff,
  generateValidationRules
} from '../milestones.js'

// Mock the fund utility
vi.mock('../fund.js', () => ({
  getShortNameFromId: (fundId) => `f${fundId}`
}))

// Mock the env
vi.mock('@/env', () => ({
  env: {
    VITE_MAX_MILESTONE_BUDGET: '0.30'
  }
}))

describe('milestones.js', () => {
  // Test data fixtures
  const mockSoms = [
    {
      id: 1,
      milestone: 1,
      cost: 10000,
      month: 2,
      completion: 20,
      signoffs: [{ id: 1, created_at: '2024-01-01' }],
      poas: [{ 
        id: 1, 
        current: true, 
        signoffs: [{ id: 1, created_at: '2024-01-15' }] 
      }],
      poa_signoff_count: 1,
      som_signoff_count: 1
    },
    {
      id: 2,
      milestone: 2,
      cost: 15000,
      month: 4,
      completion: 40,
      signoffs: [],
      poas: [],
      poa_signoff_count: 0,
      som_signoff_count: 0
    },
    {
      id: 3,
      milestone: 3,
      cost: 20000,
      month: 6,
      completion: 60,
      signoffs: [{ id: 2, created_at: '2024-01-20' }],
      poas: [],
      poa_signoff_count: 0,
      som_signoff_count: 1
    }
  ]

  const mockMilestonesWithQty = mockSoms.map(som => ({ ...som, milestones_qty: 3 }))

  const mockProposalF9 = {
    id: 1,
    budget: 100000,
    currency: 'ada',
    milestones_qty: 3,
    starting_date: '2024-01-01',
    challenges: { fund_id: 9 }
  }

  const mockProposalF10 = {
    id: 2,
    budget: 150000,
    currency: 'usd',
    milestones_qty: 4,
    starting_date: '2024-01-01',
    challenges: { fund_id: 10 }
  }

  const mockProposalF11 = {
    id: 3,
    budget: 200000,
    currency: 'ada',
    milestones_qty: 5,
    starting_date: '2024-01-01',
    challenges: { fund_id: 11 }
  }

  const mockProposalF12 = {
    id: 4,
    budget: 250000,
    currency: 'ada',
    milestones_qty: 6,
    starting_date: '2024-01-01',
    challenges: { fund_id: 12 }
  }

  const mockProposalF13 = {
    id: 5,
    budget: 300000,
    currency: 'ada',
    milestones_qty: 7,
    starting_date: '2024-01-01',
    challenges: { fund_id: 13 }
  }

  describe('getPrevMilestone', () => {
    it('should return the previous milestone correctly', () => {
      const result = getPrevMilestone(mockSoms, 3)
      expect(result).toEqual(mockSoms[1]) // milestone 2
    })

    it('should return null when no previous milestone exists', () => {
      const result = getPrevMilestone(mockSoms, 1)
      expect(result).toBeNull()
    })

    it('should return null for empty milestones array', () => {
      const result = getPrevMilestone([], 2)
      expect(result).toBeNull()
    })

    it('should handle milestones with null values', () => {
      const somsWithNull = [null, mockSoms[0], mockSoms[1]]
      const result = getPrevMilestone(somsWithNull, 3)
      expect(result).toEqual(mockSoms[1])
    })

    it('should return the highest milestone when multiple exist', () => {
      const unorderedSoms = [mockSoms[2], mockSoms[0], mockSoms[1]]
      const result = getPrevMilestone(unorderedSoms, 4)
      expect(result).toEqual(mockSoms[2]) // milestone 3
    })
  })

  describe('generateMilestoneDuration', () => {
    it('should calculate durations correctly for F9', () => {
      const result = generateMilestoneDuration(mockMilestonesWithQty, 'f9')
      
      expect(result[0]).toEqual({
        ...mockMilestonesWithQty[0],
        duration: 2,
        progress: 2,
        monthly_payment: 5000, // 10000 / 2
        previous_poa_payment: 0
      })

      expect(result[1]).toEqual({
        ...mockMilestonesWithQty[1],
        duration: 2,
        progress: 4,
        monthly_payment: 7500, // 15000 / 2
        previous_poa_payment: 0
      })
    })

    it('should calculate durations correctly for F11 (with 20% retention)', () => {
      const result = generateMilestoneDuration(mockMilestonesWithQty, 'f11')
      
      expect(result[0]).toEqual({
        ...mockMilestonesWithQty[0],
        duration: 2,
        progress: 2,
        monthly_payment: 4000, // (10000 * 0.8) / 2
        previous_poa_payment: 0
      })

      expect(result[1]).toEqual({
        ...mockMilestonesWithQty[1],
        duration: 2,
        progress: 4,
        monthly_payment: 6000, // (15000 * 0.8) / 2
        previous_poa_payment: 2000 // 10000 * 0.2
      })

      expect(result[2]).toEqual({
        ...mockMilestonesWithQty[2],
        duration: 2,
        progress: 6,
        monthly_payment: 10000, // (20000 * 1) / 2 - last milestone
        previous_poa_payment: 3000 // 15000 * 0.2
      })
    })

    it('should handle minimum duration of 1', () => {
      const overlapSoms = [
        { ...mockSoms[0], month: 1 },
        { ...mockSoms[1], month: 1, milestones_qty: 2 }
      ]
      const result = generateMilestoneDuration(overlapSoms, 'f9')
      
      expect(result[0].duration).toBe(1)
      expect(result[1].duration).toBe(1)
    })
  })

  describe('getCurrentMilestone', () => {
    it('should return undefined for empty milestones', () => {
      const result = getCurrentMilestone([])
      expect(result).toBeUndefined()
    })

    it('should calculate current milestone correctly', () => {
      const result = getCurrentMilestone(mockSoms)
      
      expect(result.milestone).toEqual(mockSoms[1]) // milestone 2 (next after signed off milestone 1)
      expect(result.availablePoAPayments).toBe(10000) // cost of milestone 1
    })

    it('should handle all milestones signed off', () => {
      const allSignedOff = mockSoms.map(som => ({ 
        ...som, 
        poa_signoff_count: 1 
      }))
      
      const result = getCurrentMilestone(allSignedOff)
      expect(result.milestone).toEqual(allSignedOff[2]) // Last milestone
    })
  })

  describe('generateValidationRules - Fund F9', () => {
    describe('Cost Validation', () => {
      it('should generate correct min cost for F9', () => {
        const rules = generateValidationRules(mockProposalF9, 1, 0, false, [])
        expect(rules.f9.minCost()).toBe(1)
      })

      it('should generate correct max cost for F9 regular milestone', () => {
        const rules = generateValidationRules(mockProposalF9, 1, 20000, false, [])
        const maxCost = rules.f9.maxCost()
        expect(maxCost).toBe(30000) // min(30000, 80000) = 30000
      })

      it('should generate correct max cost for F9 last milestone', () => {
        const rules = generateValidationRules(mockProposalF9, 3, 80000, true, [])
        const maxCost = rules.f9.maxCost()
        expect(maxCost).toBe(20000) // Available budget
      })
    })

    describe('Month Validation', () => {
      it('should generate correct min month for F9 first milestone', () => {
        const rules = generateValidationRules(mockProposalF9, 1, 0, false, [])
        expect(rules.f9.minMonth()).toBe(1)
      })

      it('should generate correct min month for F9 with previous milestone', () => {
        const rules = generateValidationRules(mockProposalF9, 2, 0, false, mockSoms)
        expect(rules.f9.minMonth()).toBe(3) // Previous month (2) + 1
      })

      it('should generate correct max month for F9', () => {
        const rules = generateValidationRules(mockProposalF9, 1, 0, false, [])
        expect(rules.f9.maxMonth()).toBe(24)
      })
    })
  })

  describe('generateValidationRules - Fund F10', () => {
    describe('Cost Validation', () => {
      it('should generate correct min cost for F10 first milestone', () => {
        const rules = generateValidationRules(mockProposalF10, 1, 0, false, [])
        const minCost = rules.f10.minCost()
        expect(minCost).toBe(7500) // min(5% of 150000, 75000)
      })

      it('should generate correct min cost for F10 last milestone', () => {
        const rules = generateValidationRules(mockProposalF10, 4, 100000, true, [])
        const minCost = rules.f10.minCost()
        expect(minCost).toBe(22500) // 15% of 150000
      })

      it('should cap first milestone max cost at 75000 for F10', () => {
        const largeProposal = { ...mockProposalF10, budget: 500000 }
        const rules = generateValidationRules(largeProposal, 1, 0, false, [])
        const maxCost = rules.f10.maxCost()
        expect(maxCost).toBe(75000)
      })

      it('should not cap max cost for non-first milestones in F10', () => {
        const rules = generateValidationRules(mockProposalF10, 2, 50000, false, [])
        const maxCost = rules.f10.maxCost()
        expect(maxCost).toBe(45000) // min(30% of 150000, available budget)
      })
    })

    describe('Month Validation', () => {
      it('should generate correct month validation for F10', () => {
        const rules = generateValidationRules(mockProposalF10, 1, 0, false, [])
        expect(rules.f10.minMonth()).toBe(1)
        expect(rules.f10.maxMonth()).toBe(24)
      })
    })
  })

  describe('generateValidationRules - Fund F11/F12/F13', () => {
    const testFunds = [
      { fund: 'f11', proposal: mockProposalF11 },
      { fund: 'f12', proposal: mockProposalF12 },
      { fund: 'f13', proposal: mockProposalF13 }
    ]

    testFunds.forEach(({ fund, proposal }) => {
      describe(`Fund ${fund.toUpperCase()}`, () => {
        it(`should generate correct min cost for ${fund}`, () => {
          const rules = generateValidationRules(proposal, 1, 0, false, [])
          const minCost = rules[fund].minCost()
          expect(minCost).toBe(proposal.budget * 0.05)
        })

        it(`should generate correct max cost for ${fund}`, () => {
          const rules = generateValidationRules(proposal, 1, 50000, false, [])
          const maxCost = rules[fund].maxCost()
          // For F13 with budget 300000, milestone 1 is capped at 75000
          const expectedMax = fund === 'f13' ? 75000 : Math.min(
            Math.ceil(proposal.budget * 0.30),
            proposal.budget - 50000
          )
          expect(maxCost).toBe(expectedMax)
        })

        it(`should generate correct min cost for ${fund} last milestone`, () => {
          const rules = generateValidationRules(proposal, proposal.milestones_qty, 150000, true, [])
          const minCost = rules[fund].minCost()
          expect(minCost).toBe(proposal.budget * 0.15)
        })

        it(`should generate correct month validation for ${fund}`, () => {
          const rules = generateValidationRules(proposal, 1, 0, false, [])
          expect(rules[fund].minMonth()).toBe(1)
          expect(rules[fund].maxMonth()).toBe(3) // 0 + 3, min with 11
        })

        it(`should generate correct month validation for ${fund} with previous milestone`, () => {
          const rules = generateValidationRules(proposal, 2, 0, false, mockSoms)
          expect(rules[fund].minMonth()).toBe(3) // Previous month (2) + 1
        })

        it(`should generate correct max month for ${fund} last milestone`, () => {
          const rules = generateValidationRules(proposal, proposal.milestones_qty, 0, true, mockSoms)
          const maxMonth = rules[fund].maxMonth()
          expect(maxMonth).toBe(7) // Previous month (6) + 1
        })
      })
    })
  })

  describe('canSubmitSomByChangeRequest', () => {
    it('should return false when no change requests exist', () => {
      const proposal = { change_request: [] }
      const som = { signoffs: [{ created_at: '2024-01-01' }] }
      
      const result = canSubmitSomByChangeRequest(proposal, som)
      expect(result).toBe(false)
    })

    it('should return false when som has no signoffs', () => {
      const proposal = {
        change_request: [{ 
          created_at: '2024-01-02', 
          resubmission: true 
        }]
      }
      const som = { signoffs: [] }
      
      const result = canSubmitSomByChangeRequest(proposal, som)
      expect(result).toBe(false)
    })

    it('should return true when change request is after som signoff and allows resubmission', () => {
      const proposal = {
        change_request: [{ 
          created_at: '2024-01-02', 
          resubmission: true 
        }]
      }
      const som = { 
        signoffs: [{ created_at: '2024-01-01' }],
        poas: []
      }
      
      const result = canSubmitSomByChangeRequest(proposal, som)
      expect(result).toBe(true)
    })

    it('should return false when change request does not allow resubmission', () => {
      const proposal = {
        change_request: [{ 
          created_at: '2024-01-02', 
          resubmission: false 
        }]
      }
      const som = { 
        signoffs: [{ created_at: '2024-01-01' }],
        poas: []
      }
      
      const result = canSubmitSomByChangeRequest(proposal, som)
      expect(result).toBe(false)
    })

    it('should return false when PoA is already signed off', () => {
      const proposal = {
        change_request: [{ 
          created_at: '2024-01-02', 
          resubmission: true 
        }]
      }
      const som = { 
        signoffs: [{ created_at: '2024-01-01' }],
        poas: [{
          current: true,
          signoffs: [{ created_at: '2024-01-03' }]
        }]
      }
      
      const result = canSubmitSomByChangeRequest(proposal, som)
      expect(result).toBe(false)
    })
  })

  describe('canAllSomsBeSignedOffByReviews', () => {
    it('should return true when all soms have sufficient approving reviews for F9', () => {
      const soms = [{
        som_reviews: [{
          current: true,
          outputs_approves: true,
          evidence_approves: true,
          success_criteria_approves: true
        }],
        signoffs: []
      }]
      
      // F9 requires only 1 review, so this should pass
      const result = canAllSomsBeSignedOffByReviews(soms, 9)
      expect(result).toBe(true)
    })

    it('should return true when all soms have sufficient approving reviews for F10+', () => {
      const soms = [{
        som_reviews: [
          {
            current: true,
            outputs_approves: true,
            evidence_approves: true,
            success_criteria_approves: true
          },
          {
            current: true,
            outputs_approves: true,
            evidence_approves: true,
            success_criteria_approves: true
          }
        ],
        signoffs: []
      }]
      
      const result = canAllSomsBeSignedOffByReviews(soms, 10)
      expect(result).toBe(true)
    })

    it('should return false when soms have insufficient reviews', () => {
      const soms = [{
        som_reviews: [{
          current: true,
          outputs_approves: true,
          evidence_approves: true,
          success_criteria_approves: true
        }],
        signoffs: []
      }]
      
      const result = canAllSomsBeSignedOffByReviews(soms, 10) // Needs 2 reviews
      expect(result).toBe(false)
    })

    it('should return false when some reviews are rejections', () => {
      const soms = [{
        som_reviews: [
          {
            current: true,
            outputs_approves: true,
            evidence_approves: false, // Rejection
            success_criteria_approves: true
          },
          {
            current: true,
            outputs_approves: true,
            evidence_approves: true,
            success_criteria_approves: true
          }
        ],
        signoffs: []
      }]
      
      const result = canAllSomsBeSignedOffByReviews(soms, 10)
      expect(result).toBe(false)
    })

    it('should return true when som is already signed off', () => {
      const soms = [{
        som_reviews: [], // No reviews
        signoffs: [{ id: 1 }] // Already signed off
      }]
      
      const result = canAllSomsBeSignedOffByReviews(soms, 10)
      expect(result).toBe(true)
    })
  })

  describe('isPreviousSomSignedOff', () => {
    it('should return true for first milestone', () => {
      const currentSom = { milestone: 1 }
      const result = isPreviousSomSignedOff(mockSoms, currentSom)
      expect(result).toBe(true)
    })

    it('should return true when previous milestone is signed off', () => {
      const currentSom = { milestone: 2 }
      const result = isPreviousSomSignedOff(mockSoms, currentSom)
      expect(result).toBe(true) // mockSoms[0] has signoffs
    })

    it('should return false when previous milestone is not signed off', () => {
      const currentSom = { milestone: 3 }
      const result = isPreviousSomSignedOff(mockSoms, currentSom)
      expect(result).toBe(false) // mockSoms[1] has no signoffs
    })

    it('should return false when previous milestone does not exist', () => {
      const currentSom = { milestone: 5 }
      const result = isPreviousSomSignedOff(mockSoms, currentSom)
      expect(result).toBe(false)
    })

    it('should return false when currentSom is null', () => {
      const result = isPreviousSomSignedOff(mockSoms, null)
      expect(result).toBe(false)
    })
  })

  describe('isPreviousPoaSignedOff', () => {
    it('should return true for first milestone', () => {
      const currentSom = { milestone: 1 }
      const result = isPreviousPoaSignedOff(mockSoms, currentSom)
      expect(result).toBe(true)
    })

    it('should return true when previous milestone PoA is signed off', () => {
      const currentSom = { milestone: 2 }
      const result = isPreviousPoaSignedOff(mockSoms, currentSom)
      expect(result).toBe(true) // mockSoms[0] has signed off PoA
    })

    it('should return false when previous milestone has no PoAs', () => {
      const currentSom = { milestone: 3 }
      const result = isPreviousPoaSignedOff(mockSoms, currentSom)
      expect(result).toBe(false) // mockSoms[1] has no PoAs
    })

    it('should return false when previous milestone PoA is not signed off', () => {
      const somsWithUnsignedPoA = [
        mockSoms[0],
        {
          ...mockSoms[1],
          poas: [{ current: true, signoffs: [] }]
        },
        mockSoms[2]
      ]
      
      const currentSom = { milestone: 3 }
      const result = isPreviousPoaSignedOff(somsWithUnsignedPoA, currentSom)
      expect(result).toBe(false)
    })

    it('should return false when currentSom is null', () => {
      const result = isPreviousPoaSignedOff(mockSoms, null)
      expect(result).toBe(false)
    })
  })

  describe('getNextPayment', () => {
    it('should return null when no milestones exist', () => {
      const result = getNextPayment([], null, 'f9')
      expect(result).toBeNull()
    })

    it('should return null for unsupported fund', () => {
      const result = getNextPayment(mockSoms, null, 'f8')
      expect(result).toBeNull()
    })

    it('should calculate payment correctly for valid scenario', () => {
      const milestones = [{
        som_signoff_count: 1,
        status: 0,
        funds_distributed: 5000,
        cost: 10000,
        monthly_payment: 2500,
        duration: 4,
        milestone: 1
      }]
      
      const current = {
        milestone: milestones[0],
        availablePoAPayments: 8000
      }
      
      const result = getNextPayment(milestones, current, 'f9')
      expect(result).toBeDefined()
      expect(result.poaPayment).toBe(3000) // 8000 - 5000
      expect(result.chunkPayment).toBe(2500) // monthly_payment
    })
  })
}) 