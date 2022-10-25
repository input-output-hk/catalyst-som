<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Proof of Achievement</h3>
      <o-checkbox v-model="content_approved">
        Approved?
      </o-checkbox>
      <QuillEditor
        class="mb-4"
        theme="snow" v-model:content="content_comment" content-type="html" />
      <o-button
        @click="handleCreatePoaReview"
        type="submit">
          Submit PoA review
      </o-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['poa'])
import { usePoaReviews } from '../store/poaReviews.js'
const { createPoaReview } = usePoaReviews()

const content_approved = ref(false)
const content_comment = ref('')

const handleCreatePoaReview = async () => {
  const response =  await createPoaReview({
    content_approved: content_approved.value,
    content_comment: content_comment.value,
    poas_id: props.poa.id
  })
  if (response) {
    content_approved.value = ''
    content_comment.value = ''
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
