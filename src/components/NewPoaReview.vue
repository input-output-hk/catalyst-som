<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Proof of Achievement</h3>
      <div class="block">
        <o-checkbox v-model="content_approved">
          PoA Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>PoA review comments:</label>
        <QuillEditor
          ref="contentEditor"
          class="mb-4"
          theme="snow" v-model:content="content_comment" content-type="html" />
      </div>
      <div class="block">
        <o-button
          variant="primary"
          size="medium"
          @click="handleCreatePoaReview"
          type="submit">
            Submit PoA review
        </o-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['poa', 'som'])
const emit = defineEmits(['poaReviewSubmitted'])
import { usePoaReviews } from '../store/poaReviews.js'
const { createPoaReview } = usePoaReviews()

const contentEditor = ref()

const content_approved = ref(false)
const content_comment = ref('')

const handleCreatePoaReview = async () => {
  const response =  await createPoaReview({
    content_approved: content_approved.value,
    content_comment: content_comment.value,
    poas_id: props.poa.id
  }, props.som)
  if (response) {
    content_approved.value = ''
    content_comment.value = ''
    emit('poaReviewSubmitted')
  }
}

const clearPoaReview = () => {
  contentEditor.value.setHTML('')
  content_approved.value = false
}

</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>
