<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Statement of Milestone</h3>
      <div class="block">
        <o-checkbox v-model="outputs_approves">
          Outputs Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>Outputs comments:</label>
        <QuillEditor
          ref="outputsEditor"
          theme="snow"
          v-model:content="outputs_comment"
          content-type="html" />
      </div>
      <div class="block">
        <o-checkbox v-model="success_criteria_approves">
          Success Criteria Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>Success Criteria comments:</label>
        <QuillEditor
          class="mb-4"
          ref="successCriteriaEditor"
          theme="snow"
          v-model:content="success_criteria_comment"
          content-type="html" />
      </div>
      <div class="block">
        <o-checkbox v-model="evidence_approves">
          Evidence Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>Evidence comments:</label>
        <QuillEditor
          class="mb-4"
          ref="evidenceEditor"
          theme="snow"
          v-model:content="evidence_comment"
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
          @click="clearSomReview">
            Clear SoM Review
        </o-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['som'])
const emit = defineEmits(['somReviewSubmitted'])
import { useSomReviews } from '@/store/somReviews.js'
const { createSomReview } = useSomReviews()

const outputsEditor = ref()
const successCriteriaEditor = ref()
const evidenceEditor = ref()

const outputs_approves = ref(false)
const outputs_comment = ref('')
const success_criteria_approves = ref(false)
const success_criteria_comment = ref('')
const evidence_approves = ref(false)
const evidence_comment = ref('')

const handleCreateSomReview = async () => {
  const response =  await createSomReview({
    outputs_approves: outputs_approves.value,
    outputs_comment: outputs_comment.value,
    success_criteria_approves: success_criteria_approves.value,
    success_criteria_comment: success_criteria_comment.value,
    evidence_approves: evidence_approves.value,
    evidence_comment: evidence_comment.value,
    som_id: props.som.id
  }, props.som)
  if (response) {
    clearSomReview()
    emit('somReviewSubmitted')
  }
}

const clearSomReview = () => {
  outputsEditor.value.setHTML('')
  successCriteriaEditor.value.setHTML('')
  evidenceEditor.value.setHTML('')
  outputs_approves.value = false
  success_criteria_approves.value = false
  evidence_approves.value = false
}

</script>
