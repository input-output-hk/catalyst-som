<template>
  <div class="content new-poa-review-popup">
    <div class="box">
      <h3>{{ $t('new_poa_review.title') }}</h3>
      <schema-form
        class="card-content scrollable-modal"
        :schema="schema"
        @submit="handleCreatePoaReview"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button
              class="new-poa-review-submit"
              variant="primary" native-type="submit">
              <span>{{ $t('new_poa_review.submit') }}</span>
            </o-button>
            <o-button @click="clearForm">
              <span>{{ $t('new_poa_review.reset') }}</span>
            </o-button>
          </div>
        </template>
      </schema-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  poa: {
    type: Object,
    default: () => {}
  },
  som: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['poaReviewSubmitted'])
import { useFormFields } from '@/composables/useFormFields.js'
import { usePoaReviews } from '@/store/poaReviews.js'
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { createPoaReview } = usePoaReviews()
import * as yup from 'yup'

const initialSchema = computed(() => {
  return {
    content_approved: {
      type: 'checkbox',
      label: t('new_poa_review.poa_approved')
    },
    content_comment: {
      type: 'html',
      label: t('new_poa_review.comment'),
      validations: yup.string().when('_', {
        is: true,
        otherwise: (schema) => {
          if (!formData.value.content_approved) {
            return schema.required()
          }
          return schema
        }
      })
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
