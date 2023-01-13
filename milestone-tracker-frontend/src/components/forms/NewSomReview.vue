<template>
  <div class="content">
    <div class="box">
      <h3>New Review for Statement of Milestone</h3>
      <schema-form
        class="card-content scrollable-modal"
        :schema="schema"
        @submit="handleCreateSomReview"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button variant="primary" native-type="submit">
              <span>Submit</span>
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
import { useFormFields } from '@/composables/useFormFields.js'
import { useSomReviews } from '@/store/somReviews.js'
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
import { SchemaFormFactory, useSchemaForm } from "formvuelate"

const props = defineProps(['som'])
const emit = defineEmits(['somReviewSubmitted'])
const { createSomReview } = useSomReviews()

const initialSchema = computed(() => {
  const schema = {}
  const keys = ['outputs', 'success_criteria', 'evidence']
  keys.forEach((key) => {
    schema[`${key}_approves`] = {
      type: 'checkbox',
      label: `${key} Approved?`
    }
    schema[`${key}_comment`] = {
      type: 'html',
      label: `${key} comments:`
    }
  })
  return schema
})

const { schema, reset } = useFormFields(initialSchema.value)
const formData = ref({})
useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin(),
])

const handleCreateSomReview = async () => {
  const response =  await createSomReview({
    ...formData.value,
    som_id: props.som.id
  }, props.som)
  if (response) {
    clearForm()
    emit('somReviewSubmitted')
  }
}

const clearForm = () => {
  formData.value = reset.value
}

</script>
