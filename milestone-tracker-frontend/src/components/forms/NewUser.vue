<template>
  <div>
    <o-button v-if="canSetChangeRequests" variant="primary" @click="confirmCreateAccount = !confirmCreateAccount">
      {{ $t('new_account.start') }}
    </o-button>
    <o-modal class="has-text-left" v-if="canSetChangeRequests" v-model:active="confirmCreateAccount">
      <div class="block new-account-popup">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              {{ $t('new_account.title') }}
            </p>
          </header>
          <div class="card-content">
            <p>
              {{ $t('new_account.confirm') }}
            </p>
            <schema-form
              :schema="schema"
              @submit="_createAccount"
            >
              <template #afterForm>
                <div class="buttons">
                  <o-button
                    :disabled="submitting"
                    class="submit-create-user"
                    variant="primary"
                    size="medium"
                    native-type="submit">
                    {{ $t('new_account.create') }}
                  </o-button>
                  <o-button
                    size="medium"
                    @click="_clearForm">
                    {{ $t('new_account.cancel') }}
                  </o-button>
                </div>
              </template>
            </schema-form>
            
          </div>
        </div>
      </div>
    </o-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useUsers } from '@/store/users.js'
import { useFormFields } from '@/composables/useFormFields.js'
import { useUser } from '@/store/user.js'

const userStore = useUsers()
const { createAccount } = userStore
const { canSetChangeRequests } = useUser()

const { t } = useI18n()

const submitting = ref(false)
const confirmCreateAccount = ref(false)

const initialSchema = computed(() => {
  return {
    email: {
      type: 'string',
      label: t('new_account.email_address'),
      help: t('new_account.email_address_help'),
      validations: yup.string().email().required()
    },
    passkey: {
      type: 'string',
      label: t('new_account.admin_passkey'),
      help: t('new_account.admin_passkey_help'),
      validations: yup.string().required()
    },
    project_id: {
      type: 'number',
      label: t('new_account.project_id'),
      help: t('new_account.project_id_help'),
      validations: yup.number().integer().required()
    }
  }
})


const { schema, clearForm } = useFormFields(initialSchema.value)
const formData = ref({})
const { updateFormModel } = useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin()
])

const _createAccount = async () => {
  const response = await createAccount(
    formData.value.email,
    formData.value.passkey,
    parseInt(formData.value.project_id),
  )
  if (response) {
    _clearForm()
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
  submitting.value = false
  confirmCreateAccount.value = false
}
</script>
