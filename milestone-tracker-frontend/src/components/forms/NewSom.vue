<template>
  <div class="block">
    <div class="card">
      <header class="card-header">
        <h4 class="card-header-title mb-0">
          New Statement of Milestone {{milestone}}
        </h4>
        <o-button class="mt-2 mr-4" variant="primary" size="small" @click="clone">Clone latest</o-button>
      </header>
      <schema-form
        class="card-content scrollable-modal"
        :schema="schema"
        @submit="handleCreateSom"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button variant="primary" native-type="submit">
              <span>Submit SoM</span>
            </o-button>
            <o-button @click="_clearForm">
              <span>Reset</span>
            </o-button>
          </div>
        </template>
      </schema-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"

import * as yup from 'yup';
const props = defineProps(['proposal', 'milestone', 'som', 'soms'])
const emit = defineEmits(['somSubmitted'])
import { useSoms } from '@/store/soms.js'
import { useFormFields } from '@/composables/useFormFields.js'
import { getPrevMilestone } from '@/utils/milestones'
const { createSom } = useSoms()

// Form validation rules

const costRule = computed(() => {
  const rule = yup.number().required().min(1)
  const maxMilestoneBudget = parseFloat(import.meta.env.VITE_MAX_MILESTONE_BUDGET)
  if (props.milestone < 5 && props.proposal.budget > 0) {
    return rule.max(props.proposal.budget * maxMilestoneBudget)
  }
  return rule
})

const monthRule = computed(() => {
  const rule = yup.number().required()
  const min = getPrevMilestone(props.soms, props.milestone)
  return rule.min((min) ? parseInt(min.month) : 1)
})

const initialSchema = computed(() => {
  return {
    title: {
      type: 'string',
      label: 'Title'
    },
    outputs: {
      type: 'html',
      label: 'Outputs'
    },
    success_criteria: {
      type: 'html',
      label: 'Success Criteria'
    },
    evidence: {
      type: 'html',
      label: 'Evidence'
    },
    cost: {
      type: 'number',
      label: 'Cost',
      validations: costRule.value,
    },
    month: {
      type: 'select',
      label: 'Month',
      validations: monthRule.value,
      required: true,
      default: 1,
      options: [...Array(24).keys()].map((m) => ({value: m + 1, label: `Month ${m + 1}`}))
    },
    completion: {
      type: 'range',
      label: 'Completion %',
      default: 10,
      min: 0,
      max: 100,
      step: 1
    }
  }
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
    proposal_id: props.proposal.id,
    challenge_id: props.proposal.challenge_id,
    milestone: props.milestone
  })
  if (response) {
    clearForm()
    emit('somSubmitted')
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
}

</script>
