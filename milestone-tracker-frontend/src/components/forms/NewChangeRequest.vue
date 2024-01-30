<template>
  <div class="block new-signoff-popup">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ $t('change_requests.new_title') }}
        </p>
      </header>
      <div class="card-content">
        <p>
          {{ $t('change_requests.new_confirm') }}
        </p>
        <schema-form
          :schema="schema"
          @submit="submitChangeRequest"
        >
          <template #afterForm>
            <div class="buttons">
              <o-button
                :disabled="submitting"
                class="submit-change-request"
                variant="primary"
                size="medium"
                native-type="submit">
                {{ $t('change_requests.new_create') }}
              </o-button>
              <o-button
                size="medium"
                @click="_clearForm">
                {{ $t('change_requests.cancel') }}
              </o-button>
            </div>
          </template>
        </schema-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useChangeRequests } from '@/store/changeRequests.js'
import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
import { useFormFields } from '@/composables/useFormFields.js'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

const initialSchema = computed(() => {
  return {
    url: {
      type: 'string',
      label: t('change_requests.url'),
      help: t('change_requests.url_help'),
      validations: yup.string().url()
    },
    resubmission: {
      type: 'checkbox',
      label: t('change_requests.resubmission'),
      help: t('change_requests.resubmission_help'),
      def: true
    }
  }
})

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  }
})

const { t } = useI18n()

const { schema, clearForm } = useFormFields(initialSchema.value)
const formData = ref({})
const { updateFormModel } = useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin()
])

const emit = defineEmits(['clearChangeRequest'])

const { createChangeRequest } = useChangeRequests()



const submitting = ref(false)

const submitChangeRequest = async () => {
  submitting.value = true
  const response = await createChangeRequest({
    ...formData.value,
    proposal_id: props.proposal.id
  })
  if (response) {
    _clearForm()
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
  submitting.value = false
  emit('clearChangeRequest')
}
</script>
