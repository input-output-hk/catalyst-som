<template>
  <div class="content new-som-review">
    <div class="box">
      <h3>{{ $t('new_som_review.title') }}</h3>
      <schema-form
        class="card-content"
        :schema="schema"
        @submit="handleCreateSomReview"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button :disabled="submitting" class="new-som-review-submit" variant="primary" native-type="submit">
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
import { HTMLMinLen } from '@/utils/validations.js'
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

const submitting = ref(false)

const initialSchema = computed(() => {
  const schema = {}
  const keys = ['outputs', 'success_criteria', 'evidence']
  keys.forEach((key) => {
    schema[`${key}_approves`] = {
      type: 'select',
      label: t(`new_som_review.${key}_approved`),
      help: t(`new_som_review.${key}_approved_help`),
      required: true,
      options: [
        { value: 'approved', label: t('new_som_review.approval_option_approved') },
        { value: 'not_approved', label: t('new_som_review.approval_option_not_approved') }
      ],
      default: '',
      validations: yup.string().required(t('validations.text_required')).oneOf(['approved', 'not_approved'])
    }
    schema[`${key}_comment`] = {
      type: 'html',
      label: t(`new_som_review.${key}_comment`),
      help: t(`new_som_review.${key}_comment_help`),
      validations: yup.string().when([`${key}_approves`], {
        is: (approves) => approves === 'not_approved',
        then: (schema) => {
          const minLength = 75
          const minLengthValidation = HTMLMinLen(minLength)
          return schema.required().test('len', t('validations.min_text_required', {min: minLength}), minLengthValidation)
        },
        otherwise: (schema) => {
          const minLength = 75
          const minLengthValidation = HTMLMinLen(minLength)
          return schema.required().test('len', t('validations.min_text_required', {min: minLength}), minLengthValidation)
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
  submitting.value = true
  
  // Convert select field values to boolean for backend
  const reviewData = { ...formData.value }
  const keys = ['outputs', 'success_criteria', 'evidence']
  keys.forEach((key) => {
    reviewData[`${key}_approves`] = reviewData[`${key}_approves`] === 'approved'
  })
  
  const response =  await createSomReview({
    ...reviewData,
    som_id: props.som.id,
    current: true
  }, props.som)
  if (response) {
    _clearForm()
    emit('somReviewSubmitted')
  }
}

const _clearForm = () => {
  submitting.value = false
  clearForm(formData, updateFormModel)
}

</script>
