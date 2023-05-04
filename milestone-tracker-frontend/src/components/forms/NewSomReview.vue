<template>
  <div class="content new-som-review">
    <div class="box">
      <h3>{{ $t('new_som_review.title') }}</h3>
      <schema-form
        class="card-content scrollable-modal"
        :schema="schema"
        @submit="handleCreateSomReview"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button class="new-som-review-submit" variant="primary" native-type="submit">
              <span>{{ $t('new_som_review.submit') }}</span>
            </o-button>
            <o-button @click="clearForm">
              <span>{{ $t('new_som_review.reset') }}</span>
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
import VeeValidatePlugin from '@formvuelate/plugin-vee-validate'
import { SchemaFormFactory, useSchemaForm } from 'formvuelate'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

const { t } = useI18n()
const props = defineProps({
  som: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['somReviewSubmitted'])
const { createSomReview } = useSomReviews()

const initialSchema = computed(() => {
  const schema = {}
  const keys = ['outputs', 'success_criteria', 'evidence']
  keys.forEach((key) => {
    schema[`${key}_approves`] = {
      type: 'checkbox',
      label: t(`new_som_review.${key}_approved`),
      help: t(`new_som_review.${key}_approved_help`),
    }
    schema[`${key}_comment`] = {
      type: 'html',
      label: t(`new_som_review.${key}_comment`),
      help: t(`new_som_review.${key}_comment_help`),
      validations: yup.string().when('_', {
        is: true,
        otherwise: (schema) => {
          if (!formData.value[`${key}_approves`]) {
            return schema.required()
          }
          return schema
        }
      })
    }
  })
  return schema
})

const { schema, clearForm } = useFormFields(initialSchema.value)
const formData = ref({})
const { updateFormModel } = useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin(),
])

const handleCreateSomReview = async () => {
  const response =  await createSomReview({
    ...formData.value,
    som_id: props.som.id
  }, props.som)
  if (response) {
    _clearForm()
    emit('somReviewSubmitted')
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
}

</script>
