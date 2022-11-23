<template>
  <div class="block">
    <div class="card">
      <header class="card-header">
        <h4 class="card-header-title mb-0">
          New Statement of Milestone {{milestone}}
        </h4>
        <o-button class="mt-2 mr-4" variant="primary" size="small" @click="clone">Clone latest</o-button>
      </header>
      <Form @submit="handleCreateSom" class="card-content scrollable-modal" :validation-schema="somSchema">
        <Field name="title" v-slot="{ field, errors, meta }">
          <o-field label="Title" :variant="errors[0] ? 'danger' : ''" :message="errors[0] ? errors[0] : ''">
            <o-input v-model="form.title" type="text" v-bind="field"></o-input>
          </o-field>
        </Field>
        <div class="mb-2 has-text-weight-semibold">Outputs:</div>
        <QuillEditor
          class="mb-4"
          ref="outputsEditor"
          theme="snow" v-model:content="form.outputs" content-type="html" />
        <div class="mb-2 has-text-weight-semibold">Acceptance criteria:</div>
        <QuillEditor
          class="mb-4"
          ref="successCriteriaEditor"
          theme="snow" v-model:content="form.success_criteria" content-type="html" />
        <div class="mb-2 has-text-weight-semibold">Evidence:</div>
        <QuillEditor
          class="mb-4"
          ref="evidenceEditor"
          theme="snow" v-model:content="form.evidence" content-type="html" />

        <Field name="month" v-slot="{ field, errors, meta }">
          <o-field label="Month" :variant="errors[0] ? 'danger' : ''" :message="errors[0] ? errors[0] : ''">
            <o-select placeholder="Select a month" v-model="form.month" v-bind="field">
              <option :value="m + 1"
                v-for="m in [...Array(24).keys()]">
                Month {{m + 1}}
              </option>
            </o-select>
          </o-field>
        </Field>
        <Field name="cost" v-slot="{ field, errors, meta }">
          <o-field label="Cost" :variant="errors[0] ? 'danger' : ''" :message="errors[0] ? errors[0] : ''">
            <o-input v-model="form.cost" type="number" v-bind="field"></o-input>
          </o-field>
        </Field>
        <o-field label="% progress">
          <o-slider size="medium" :min="0" :max="100" v-model="form.completion">
            <template v-for="val in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]" :key="val">
              <o-slider-tick :value="val">{{ val }}</o-slider-tick>
            </template>
          </o-slider>
        </o-field>
        <div class="buttons">
          <button class="button is-primary is-medium mt-6"
            variant="primary"
            size="medium">
              Submit SoM
          </button>
          <o-button
            size="medium"
            class="mt-6"
            @click="clearForm"
            type="submit">
              Clear SoM
          </o-button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
const props = defineProps(['proposal', 'milestone', 'som'])
const emit = defineEmits(['somSubmitted'])
import { useSoms } from '@/store/soms.js'
const { createSom } = useSoms()

const outputsEditor = ref()
const successCriteriaEditor = ref()
const evidenceEditor = ref()

const initialForm = {
  title: '',
  outputs: '',
  success_criteria: '',
  evidence: '',
  cost: 0,
  month: 1,
  completion: 10
}

const form = reactive({...initialForm})

const clone = () => {
  if (props.som) {
    outputsEditor.value.setHTML(props.som.outputs)
    successCriteriaEditor.value.setHTML(props.som.success_criteria)
    evidenceEditor.value.setHTML(props.som.evidence)
    form.title = props.som.title
    form.month = props.som.month
    form.completion = props.som.completion
    form.cost = props.som.cost
  }
}

const handleCreateSom = async () => {
  const response =  await createSom({
    ...form,
    proposal_id: props.proposal.id,
    milestone: props.milestone
  })
  if (response) {
    clearForm()
    emit('somSubmitted')
  }
}

const clearForm = () => {
  Object.assign(form, initialForm)
  outputsEditor.value.setHTML('')
  successCriteriaEditor.value.setHTML('')
  evidenceEditor.value.setHTML('')
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
  return rule.min(1)
});

const somSchema = yup.object({
  title: yup.string().required(),
  month: monthRule.value,
  cost: costRule.value
});
</script>
