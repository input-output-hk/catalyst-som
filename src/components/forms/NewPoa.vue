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
          theme="snow" v-model:content="content" content-type="html" />
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
import { ref, onMounted } from 'vue'
const props = defineProps(['proposal', 'som', 'milestone'])
import { usePoas } from '@/store/poas.js'
const { createPoa } = usePoas()

const contentEditor = ref()
const content = ref('')

const handleCreatePoa = async () => {
  const response = await createPoa({
    content: content.value,
    proposal_id: props.proposal.id,
    challenge_id: props.proposal.challenge_id,
    som_id: props.som.id,
  }, props.som)
  if (response) {
    clearForm()
  }
}

const clearForm = () => {
  contentEditor.value.setHTML('')
}
</script>
