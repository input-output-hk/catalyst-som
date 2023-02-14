<template>
  <div class="block new-som-popup">
    <div class="card">
      <header class="card-header">
        <h4 class="card-header-title mb-0">
          {{ $t('new_som.component_title', {nr: milestone}) }}
        </h4>
        <o-button class="mt-2 mr-4" variant="primary" size="small" @click="clone">
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
            <o-button variant="primary" native-type="submit">
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

import * as yup from 'yup';
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
const emit = defineEmits(['somSubmitted'])
import { useSoms } from '@/store/soms.js'
import { useFormFields } from '@/composables/useFormFields.js'
import { getPrevMilestone } from '@/utils/milestones'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { createSom } = useSoms()

const otherSoms = computed(() => {
  if (props.som) {
    return props.soms.filter((som) => {
      if (som) {
        return props.som.id !== som.id
      }
      return false
    })
  }
  return []
})

const otherSomsBudget = computed(() => {
  return otherSoms.value.reduce((acc, som) => acc + som.cost, 0)
})

// Form validation rules

const costRule = computed(() => {
  const rule = yup.number().required().min(1)
  const availableBudget = props.proposal.budget - otherSomsBudget.value
  const maxMilestoneBudget = parseFloat(import.meta.env.VITE_MAX_MILESTONE_BUDGET)
  const budgetRule = Math.min(
    (props.proposal.budget * maxMilestoneBudget), availableBudget
  )
  if (props.milestone < 5 && props.proposal.budget > 0) {
    return rule.max(budgetRule)
  }
  return rule
})

const monthRule = computed(() => {
  const rule = yup.number().required()
  const min = getPrevMilestone(props.soms, props.milestone)
  return rule.min((min) ? parseInt(min.month) : 1)
})

const initialSchema = computed(() => {
  const localSchema = {
    title: {
      type: 'string'
    },
    outputs: {
      type: 'html'
    },
    success_criteria: {
      type: 'html'
    },
    evidence: {
      type: 'html'
    },
    cost: {
      type: 'number',
      validations: costRule.value
    },
    month: {
      type: 'select',
      validations: monthRule.value,
      required: true,
      default: 1,
      options: [...Array(24).keys()].map((m) => ({value: m + 1, label: `Month ${m + 1}`}))
    },
    completion: {
      type: 'range',
      default: 10,
      min: 0,
      max: 100,
      step: 1
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
  const response =  await createSom({
    ...formData.value,
    current: true,
    proposal_id: props.proposal.id,
    challenge_id: props.proposal.challenge_id,
    milestone: props.milestone
  })
  if (response) {
    _clearForm()
    emit('somSubmitted')
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
}

</script>
