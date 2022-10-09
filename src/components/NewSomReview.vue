<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Statement of Milestone</h3>
      <o-checkbox v-model="outputs_approves">
        Outputs Approved?
      </o-checkbox>
      <o-field label="Outputs comments">
        <o-input v-model="outputs_comment" type="textarea"></o-input>
      </o-field>
      <o-checkbox v-model="success_criteria_approves">
        Success Criteria Approved?
      </o-checkbox>
      <o-field label="Success Criteria comments">
        <o-input v-model="success_criteria_comment" type="textarea"></o-input>
      </o-field>
      <o-checkbox v-model="evidence_approves">
        Evidence Approved?
      </o-checkbox>
      <o-field label="Evidence comments">
        <o-input v-model="evidence_comment" type="textarea"></o-input>
      </o-field>
      <o-button
        @click="handleCreateSomReview"
        type="submit">
          Submit SoM review
      </o-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['som'])
import { useSomReviews } from '../store/somReviews.js'
const { createSomReview } = useSomReviews()

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
  })
  if (response) {
    outputs_approves.value = ''
    outputs_comment.value = ''
    success_criteria_approves.value = ''
    success_criteria_comment.value = ''
    evidence_approves.value = ''
    evidence_comment.value = ''
  }
}
</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>
