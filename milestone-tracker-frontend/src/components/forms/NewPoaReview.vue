<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Proof of Achievement</h3>
      <schema-form
        class="card-content scrollable-modal"
        :schema="schema"
        @submit="handleCreatePoaReview"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button variant="primary" native-type="submit">
              <span>Submit PoA review</span>
            </o-button>
            <o-button @click="clearForm">
              <span>Reset</span>
            </o-button>
          </div>
        </template>
      </schema-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps(['poa', 'som'])
const emit = defineEmits(['poaReviewSubmitted'])
import { useFormFields } from '@/composables/useFormFields.js'
import { usePoaReviews } from '@/store/poaReviews.js'
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
import { SchemaFormFactory, useSchemaForm } from "formvuelate"
const { createPoaReview } = usePoaReviews()

const initialSchema = computed(() => {
  return {
    content_approved: {
      type: 'checkbox',
      label: `PoA Approved?`
    },
    content_comment: {
      type: 'html',
      label: 'Comment'
    }
  }
})

const { schema, clearForm } = useFormFields(initialSchema.value)
const formData = ref({})
const { updateFormModel } = useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin(),
])

const handleCreatePoaReview = async () => {
  const response =  await createPoaReview({
    ...formData.value,
    poas_id: props.poa.id
  }, props.som)
  if (response) {
    _clearForm()
    emit('poaReviewSubmitted')
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
}

</script>
