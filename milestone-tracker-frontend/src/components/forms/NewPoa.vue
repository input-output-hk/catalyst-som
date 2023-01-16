<template>
  <div class="block">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          New Proof of Achivement for {{milestone}}
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
              <span>Submit PoA</span>
            </o-button>
            <o-button @click="_clearForm">
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
import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
const props = defineProps(['proposal', 'som', 'milestone'])
import { useFormFields } from '@/composables/useFormFields.js'
import { usePoas } from '@/store/poas.js'
const { createPoa } = usePoas()

const initialSchema = computed(() => {
  return {
    content: {
      type: 'html',
      label: 'Content'
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
