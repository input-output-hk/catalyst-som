<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Proof of Achievement</h3>
      <div class="block">
        <o-checkbox v-model="form.content_approved">
          PoA Approved?
        </o-checkbox>
      </div>
      <div class="block">
        <label>PoA review comments:</label>
        <QuillEditor
          ref="contentEditor"
          class="mb-4"
          theme="snow" v-model:content="form.content_comment" content-type="html" />
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
import { ref, reactive } from 'vue'
const props = defineProps(['poa', 'som'])
const emit = defineEmits(['poaReviewSubmitted'])
import { usePoaReviews } from '@/store/poaReviews.js'
const { createPoaReview } = usePoaReviews()

const contentEditor = ref()

const initialForm = {
  content_approved: false,
  content_comment: ''
}

const form = reactive({...initialForm})

const handleCreatePoaReview = async () => {
  const response =  await createPoaReview({
    ...form,
    poas_id: props.poa.id
  }, props.som)
  if (response) {
    clearForm()
    emit('poaReviewSubmitted')
  }
}

const clearForm = () => {
  Object.assign(form, initialForm)
  contentEditor.value.setHTML('')
}

</script>
