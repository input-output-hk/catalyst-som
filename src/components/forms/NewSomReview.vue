<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Statement of Milestone</h3>
      <div class="block">
        <o-checkbox v-model="form.outputs_approves">
          Outputs Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>Outputs comments:</label>
        <QuillEditor
          ref="outputsEditor"
          theme="snow"
          v-model:content="form.outputs_comment"
          content-type="html" />
      </div>
      <div class="block">
        <o-checkbox v-model="form.success_criteria_approves">
          Success Criteria Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>Success Criteria comments:</label>
        <QuillEditor
          class="mb-4"
          ref="successCriteriaEditor"
          theme="snow"
          v-model:content="form.success_criteria_comment"
          content-type="html" />
      </div>
      <div class="block">
        <o-checkbox v-model="form.evidence_approves">
          Evidence Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>Evidence comments:</label>
        <QuillEditor
          class="mb-4"
          ref="evidenceEditor"
          theme="snow"
          v-model:content="form.evidence_comment"
          content-type="html" />
      </div>
      <div class="buttons">
        <o-button
          variant="primary"
          size="medium"
          @click="handleCreateSomReview">
            Submit SoM review
        </o-button>
        <o-button
          size="medium"
          @click="clearForm">
            Clear SoM Review
        </o-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const props = defineProps(['som'])
const emit = defineEmits(['somReviewSubmitted'])
import { useSomReviews } from '@/store/somReviews.js'
const { createSomReview } = useSomReviews()

const outputsEditor = ref()
const successCriteriaEditor = ref()
const evidenceEditor = ref()

const initialForm = {
  outputs_approves: false,
  outputs_comment: '',
  success_criteria_approves: false,
  success_criteria_comment: '',
  evidence_approves: false,
  evidence_comment: ''
}

const form = reactive({...initialForm})

const handleCreateSomReview = async () => {
  const response =  await createSomReview({
    ...form,
    som_id: props.som.id
  }, props.som)
  if (response) {
    clearForm()
    emit('somReviewSubmitted')
  }
}

const clearForm = () => {
  Object.assign(form, initialForm)
  outputsEditor.value.setHTML('')
  successCriteriaEditor.value.setHTML('')
  evidenceEditor.value.setHTML('')
}

</script>
