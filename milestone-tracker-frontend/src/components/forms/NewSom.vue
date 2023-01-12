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
        @reset="_clearForm"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button variant="primary" native-type="submit">
              <span>Submit</span>
            </o-button>
            <o-button native-type="reset">
              <span>Reset</span>
            </o-button>
          </div>
        </template>
      </schema-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'

import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import FieldHtml from "@/components/forms/formFields/FieldHtml.vue"
import FieldInput from "@/components/forms/formFields/FieldInput.vue"
import FieldNumber from "@/components/forms/formFields/FieldNumber.vue"
import FieldSelect from "@/components/forms/formFields/FieldSelect.vue"
import FieldRange from "@/components/forms/formFields/FieldRange.vue"

markRaw(FieldHtml)
markRaw(FieldInput)
markRaw(FieldNumber)
markRaw(FieldSelect)
markRaw(FieldRange)

import * as yup from 'yup';
const props = defineProps(['proposal', 'milestone', 'som', 'soms'])
const emit = defineEmits(['somSubmitted'])
import { useSoms } from '@/store/soms.js'
import { getPrevMilestone } from '@/utils/milestones'
const { createSom } = useSoms()

const initialForm = {
  title: '',
  outputs: '',
  success_criteria: '',
  evidence: '',
  cost: 0,
  month: 1,
  completion: 10
}

const schema = computed(() => {
  return {
    title: {
      component: FieldInput,
      label: 'Title',
      validations: yup.string().required(),
      default: initialForm.title
    },
    outputs: {
      component: FieldHtml,
      label: 'Outputs',
      validations: yup.string().required(),
      default: initialForm.outputs
    },
    success_criteria: {
      component: FieldHtml,
      label: 'Success Criteria',
      validations: yup.string().required(),
      default: initialForm.success_criteria
    },
    evidence: {
      component: FieldHtml,
      label: 'Evidence',
      validations: yup.string().required(),
      default: initialForm.evidence
    },
    cost: {
      component: FieldNumber,
      label: 'Cost',
      validations: costRule.value,
      default: initialForm.cost.toFixed(0)
    },
    month: {
      component: FieldSelect,
      label: 'Month',
      validations: monthRule.value,
      default: initialForm.month,
      options: [...Array(24).keys()].map((m) => ({value: m, label: `Month ${m}`}))
    },
    completion: {
      component: FieldRange,
      label: 'Completion %',
      validations: yup.number().required().min(0).max(100),
      default: initialForm.completion,
      min: 0,
      max: 100,
      step: 1
    }
  }
})

const formData = ref({})

useSchemaForm(formData);

let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin(),
]);





const clone = () => {
  if (props.som) {
    Object.keys(formData.value).forEach((k) => {
      let value = props.som[k]
      if (k === 'cost') {
        value = value.toFixed(0)
      }
      formData.value[k] = value
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
  formData.value = {}
}

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

const somSchema = yup.object({
  title: yup.string().required(),
  month: monthRule.value,
  cost: costRule.value
})

</script>
