<template>
  <div class="block">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ $t('new_poa.title', {nr: milestone}) }}
        </p>
      </header>
      <schema-form
        class="card-content scrollable-modal"
        :schema="schema"
        @submit="handleCreatePoa"
        >
        <template #afterForm>
          <div class="buttons">
            <o-button variant="primary" native-type="submit">
              <span>{{ $t('new_poa.submit') }}</span>
            </o-button>
            <o-button @click="_clearForm">
              <span>{{ $t('new_poa.reset') }}</span>
            </o-button>
          </div>
        </template>
      </schema-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
const props = defineProps(['proposal', 'som', 'milestone'])
import { useFormFields } from '@/composables/useFormFields.js'
import { usePoas } from '@/store/poas.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { createPoa } = usePoas()

const initialSchema = computed(() => {
  return {
    content: {
      type: 'html',
      label: t('new_poa.content')
    }
  }
})


const { schema, clearForm } = useFormFields(initialSchema.value)
const formData = ref({})
const { updateFormModel } = useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin()
])

const handleCreatePoa = async () => {
  const response = await createPoa({
    ...formData.value,
    current: true,
    proposal_id: props.proposal.id,
    challenge_id: props.proposal.challenge_id,
    som_id: props.som.id,
  }, props.som)
  if (response) {
    clearForm()
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
}
</script>
