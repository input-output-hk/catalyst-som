<template>
  <div class="block new-som-popup">
    <div class="card">
      <header class="card-header">
        <h4 class="card-header-title mb-0">
          {{ $t('new_som.component_title', {nr: milestone}) }}
        </h4>
        <o-button v-if="props.som" class="mt-2 mr-4" variant="primary" size="small" @click="clone">
          {{ $t('new_som.clone_latest') }}
        </o-button>
      </header>
      <schema-form
        class="card-content scrollable-modal"
        :schema="schema"
        @submit="handleCreateSom"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button :disabled="submitting" variant="primary" native-type="submit">
              <span>{{ $t('new_som.submit') }}</span>
            </o-button>
            <o-button @click="_clearForm">
              <span>{{ $t('new_som.reset') }}</span>
            </o-button>
          </div>
        </template>
      </schema-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"

import * as yup from 'yup'

import { useSoms } from '@/store/soms.js'
import { useFormFields } from '@/composables/useFormFields.js'
import { getPrevMilestone } from '@/utils/milestones'
import { getShortNameFromId } from '@/utils/fund'
import { HTMLNotEmpty } from '@/utils/validations.js'
import { useI18n } from 'vue-i18n'
import { env } from '@/env'

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
  milestone: {
    type: Number,
    default: 0
  },
  som: {
    type: Object,
    default: () => {}
  },
  soms: {
    type: Array,
    default: () => []
  },
})
const emit = defineEmits(['somSubmitted', 'refreshRecap'])

const { t, n, d } = useI18n()
const { createSom } = useSoms()


const otherSoms = computed(() => {
  if (props.soms) {
    return props.soms.filter((som) => {
      if (som) {
        if (props.som) {
          return props.som.id !== som.id
        } else {
          return true
        }
      }
      return false
    })
  }
  return []
})

const submitting = ref(false)

const otherSomsBudget = computed(() => {
  const lastMilestone = props.proposal.milestones_qty
  const milestonesIndex = [...Array(lastMilestone).keys()].map(i => i + 1)
  let definedCost = otherSoms.value.reduce((acc, som) => acc + som.cost, 0)
  const missingMilestones = milestonesIndex.filter(m => !otherSoms.value.map(o => o.milestone).includes(m))
  missingMilestones.forEach((m) => {
    if (m !== props.milestone) {
      const cost = (m === lastMilestone) ? props.proposal.budget * 0.15 : props.proposal.budget * 0.05
      definedCost = definedCost + cost
    }
  })
  return definedCost
})

const isLastMilestone = computed(() => {
  const lastMilestone = props.proposal.milestones_qty
  return props.milestone === lastMilestone
})

const milestoneRules = {
  f9: {
    minCost: () => 1,
    maxCost: () => {
      const availableBudget = props.proposal.budget - otherSomsBudget.value
      const maxMilestoneBudget = parseFloat(env.VITE_MAX_MILESTONE_BUDGET)
      const budgetRule = Math.min(
        (props.proposal.budget * maxMilestoneBudget), availableBudget
      )
      if (!isLastMilestone.value && props.proposal.budget > 0) {
        return budgetRule
      } else {
        return availableBudget
      }
    },
    minMonth: () => {
      const min = getPrevMilestone(props.soms, props.milestone)
      return (min) ? parseInt(min.month) + 1 : 1
    },
    maxMonth: () => 24
  },
  f10: {
    minCost: () => {
      let _min = props.proposal.budget * 0.05
      if (props.milestone === 1) {
        _min = Math.min(_min, 75000)
      }
      if (isLastMilestone.value) {
        _min = props.proposal.budget * 0.15
      }
      return _min
    },
    maxCost: () => {
      const availableBudget = props.proposal.budget - otherSomsBudget.value
      const maxMilestoneBudget = 0.30
      const budgetRule = Math.min(
        (props.proposal.budget * maxMilestoneBudget), availableBudget
      )
      const _max = (!isLastMilestone.value && props.proposal.budget > 0) ? budgetRule : availableBudget
      if (props.milestone === 1) {
        return Math.min(_max, 75000)
      }
      return _max
    },
    minMonth: () => {
      const min = getPrevMilestone(props.soms, props.milestone)
      return (min) ? parseInt(min.month) + 1 : 1
    },
    maxMonth: () => 24
  },
  f11: {
    minCost: () => {
      let _min = props.proposal.budget * 0.05
      if (props.milestone === 1) {
        _min = Math.min(_min, 75000)
      }
      if (isLastMilestone.value) {
        _min = props.proposal.budget * 0.15
      }
      return _min
    },
    maxCost: () => {
      const availableBudget = props.proposal.budget - otherSomsBudget.value
      const maxMilestoneBudget = 0.30
      const budgetRule = Math.min(
        (props.proposal.budget * maxMilestoneBudget), availableBudget
      )
      const _max = (!isLastMilestone.value && props.proposal.budget > 0) ? budgetRule : availableBudget
      if (props.milestone === 1) {
        return Math.min(_max, 75000)
      }
      return _max
    },
    minMonth: () => {
      const min = getPrevMilestone(props.soms, props.milestone)
      return (min) ? parseInt(min.month) + 1 : 1
    },
    maxMonth: () => {
      const last = getPrevMilestone(props.soms, props.milestone)
      const lastMonth = (last) ? parseInt(last.month) : 0
      return (isLastMilestone.value) ? lastMonth + 1 : lastMonth + 3
    }
  }
}

// Form validation rules

const maxMilestoneCost = computed(() => {
  const fund = getShortNameFromId(props.proposal.challenges.fund_id)
  return milestoneRules[fund].maxCost()
})

const minMilestoneCost = computed(() => {
  const fund = getShortNameFromId(props.proposal.challenges.fund_id)
  return milestoneRules[fund].minCost()
})

const costRule = computed(() => {
  const rule = yup.number().integer().required().min(minMilestoneCost.value)
  return rule.max(maxMilestoneCost.value).test(
    'Only digits',
    'Error: field can contain only digits',
    (value) => {
      return /^\d+$/.test(value)
    }
  )
})

const maxMilestoneMonth = computed(() => {
  const fund = getShortNameFromId(props.proposal.challenges.fund_id)
  return milestoneRules[fund].maxMonth()
})

const minMilestoneMonth = computed(() => {
  const fund = getShortNameFromId(props.proposal.challenges.fund_id)
  return milestoneRules[fund].minMonth()
})


const monthRule = computed(() => {
  return yup.number().required().min(minMilestoneMonth.value).max(maxMilestoneMonth.value)
})

const completionRule = computed(() => {
  const rule = yup.number().required()
  const min = getPrevMilestone(props.soms, props.milestone)
  const offset = (isLastMilestone.value) ? 1 : 10
  return rule.min((min) ? parseInt(min.completion) + offset : 10)
})

const monthOptions = computed(() => {
  const months = [...Array(24).keys()].slice(minMilestoneMonth.value -1, maxMilestoneMonth.value)
  return months.map((m) => {
    const startDate = new Date(props.proposal.starting_date)
    const monthName = d(new Date(startDate.setMonth(startDate.getMonth() + parseInt(m + 1))), 'month_only')
    return {
      value: m + 1,
      label: `Month ${m + 1} - ${monthName}`
    }
  })
})

const initialSchema = computed(() => {
  const localSchema = {
    title: {
      type: 'string',
      help: t('new_som.title_help')
    },
    outputs: {
      type: 'html',
      help: t('new_som.outputs_help'),
      validations: yup.string().test('len', t('validations.text_required'), HTMLNotEmpty)
    },
    success_criteria: {
      type: 'html',
      help: t('new_som.success_criteria_help'),
      validations: yup.string().test('len', t('validations.text_required'), HTMLNotEmpty)
    },
    evidence: {
      type: 'html',
      help: t('new_som.evidence_help'),
      validations: yup.string().test('len', t('validations.text_required'), HTMLNotEmpty)
    },
    cost: {
      type: 'number',
      validations: costRule.value,
      step: 1,
      help: t(
        'new_som.cost_help',
        {
          currency: (props.proposal.currency === 'ada') ?  'ADA' : 'US$' ,
          maxCost: n(maxMilestoneCost.value, 'currency', { currency: props.proposal.currency })
        }
      ),
    },
    month: {
      type: 'select',
      validations: monthRule.value,
      required: true,
      default: 1,
      options: monthOptions.value,
      help: t('new_som.month_help')
    },
    completion: {
      type: 'range',
      validations: completionRule.value,
      default: 10,
      min: 0,
      max: 100,
      step: 1,
      help: t('new_som.completion_help')
    }
  }
  Object.keys(localSchema).forEach((field) => {
    localSchema[field].label = t(`new_som.${field}`)
  })
  return localSchema
})

const { schema, clearForm } = useFormFields(initialSchema.value)
const formData = ref({})
const { updateFormModel } = useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin()
])

const clone = () => {
  if (props.som) {
    Object.keys(schema.value).forEach((k) => {
      let value = props.som[k]
      if (k === 'cost') {
        value = value.toFixed(0)
      }
      const field = schema.value[k]
      const val = (field.type === 'html') ? {type: 'update', content: value} : value
      const formDataVal = (formData.value[k]) ? formData.value[k] : ''
      if (value !== formDataVal) {
        updateFormModel(k, val)
      }
    })
  }
}

const handleCreateSom = async () => {
  submitting.value = true
  const response =  await createSom({
    ...formData.value,
    cost: parseInt(formData.value.cost),
    current: true,
    proposal_id: props.proposal.id,
    challenge_id: props.proposal.challenge_id,
    milestone: props.milestone
  })
  if (response) {
    emit('somSubmitted')
    const fullSubmissions = (props.proposal.milestones_qty === otherSoms.value.length + 1)
    if (fullSubmissions) {
      emit('refreshRecap')
    }
    _clearForm()
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
  submitting.value = false
}

</script>
