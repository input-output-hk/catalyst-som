<template>
  <div class="block">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          New Proof of Achivement for {{milestone}}
        </p>
      </header>
      <div class="card-content">
        <QuillEditor
          class="mb-4"
          ref="contentEditor"
          theme="snow" v-model:content="form.content" content-type="html" />
        <o-button
          @click="handleCreatePoa"
          type="submit">
            Create PoA
        </o-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const props = defineProps(['proposal', 'som', 'milestone'])
import { usePoas } from '@/store/poas.js'
const { createPoa } = usePoas()

const contentEditor = ref()

const initialForm = {
  content: ''
}

const form = reactive({...initialForm})

const handleCreatePoa = async () => {
  const response = await createPoa({
    ...form,
    proposal_id: props.proposal.id,
    challenge_id: props.proposal.challenge_id,
    som_id: props.som.id,
  }, props.som)
  if (response) {
    clearForm()
  }
}

const clearForm = () => {
  Object.assign(form, initialForm)
  contentEditor.value.setHTML('')
}
</script>
