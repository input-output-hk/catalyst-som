<template>
  <div class="block">
    <div class="card">
      <header class="card-header">
        <h4 class="card-header-title mb-0">
          New Statement of Milestone {{milestone}}
        </h4>
      </header>
      <Form class="card-content" :validation-schema="somSchema">
        <o-field label="Title">
          <o-input v-model="title" type="text"></o-input>
        </o-field>
        <div class="mb-2 has-text-weight-semibold">Outputs:</div>
        <QuillEditor
          class="mb-4"
          theme="snow" v-model:content="outputs" content-type="html" />
        <div class="mb-2 has-text-weight-semibold">Acceptance criteria:</div>
        <QuillEditor
          class="mb-4"
          theme="snow" v-model:content="success_criteria" content-type="html" />
        <div class="mb-2 has-text-weight-semibold">Evidence:</div>
        <QuillEditor
          class="mb-4"
          theme="snow" v-model:content="evidence" content-type="html" />
        <o-field label="Month">
          <o-select placeholder="Select a month" v-model="month">
            <option :value="m + 1"
              v-for="m in [...Array(24).keys()]">
              Month {{m + 1}}
            </option>
          </o-select>
        </o-field>
        <Field name="cost" v-slot="{ field, errors, meta }">
          <o-field
            label="Cost"
            :variant="errors[0] ? 'danger' : ''"
            :message="errors[0] ? errors[0] : ''"
          >
            <o-input v-model="cost" type="number" v-bind="field"></o-input>
          </o-field>
        </Field>
        <o-field label="% progress">
          <o-slider size="medium" :min="0" :max="100" v-model="completion">
            <template v-for="val in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]" :key="val">
              <o-slider-tick :value="val">{{ val }}</o-slider-tick>
            </template>
          </o-slider>
        </o-field>
        <o-button
          variant="primary"
          size="medium"
          class="mt-6"
          @click="handleCreateSom"
          type="submit">
            Submit SoM
        </o-button>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
const props = defineProps(['proposal', 'milestone'])
import { useSoms } from '../store/soms.js'
const { createSom } = useSoms()

const title = ref('')
const outputs = ref('')
const success_criteria = ref('')
const evidence = ref('')
const cost = ref(0)
const month = ref(1)
const completion = ref(10)

const handleCreateSom = async () => {
  const response =  await createSom({
    title: title.value,
    outputs: outputs.value,
    success_criteria: success_criteria.value,
    evidence: evidence.value,
    month: month.value,
    completion: completion.value,
    cost: cost.value,
    proposal_id: props.proposal.id,
    milestone: props.milestone
  })
  if (response) {
    title.value = ''
    outputs.value = ''
    success_criteria.value = ''
    evidence.value = ''
    month.value = 1
    completion.value = 10
    cost.value = 0
  }
  console.log(response)
}

const costRule = computed(() => {
  const rule = yup.number().required().min(1)
  const maxMilestoneBudget = parseFloat(import.meta.env.VITE_MAX_MILESTONE_BUDGET)
  if (props.milestone < 5 && props.proposal.budget > 0) {
    return rule.max(props.proposal.budget * maxMilestoneBudget)
  }
  return rule
})

const somSchema = yup.object({
  cost: costRule.value
});
</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>
