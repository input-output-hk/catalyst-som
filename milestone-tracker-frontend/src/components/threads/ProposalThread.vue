<template>
  <o-collapse class="card proposal-thread" :open="false" animation="slide" @open="openCallback">
    <template #trigger="_props">
      <div class="card-header thread-header" role="button">
        <p class="card-header-title">
          {{ $t('thread.title') }}
        </p>
        <a class="card-header-icon">
          <o-icon :icon="_props.open ? 'caret-up' : 'caret-down'" />
        </a>
      </div>
    </template>
    <div class="content mb-0 columns is-multiline is-gapless">
      <div ref="threadsScroll" class="messages-container" @scroll="handleScroll">
        <div v-for="thread in proposalThreads(proposal.id)" :key="`thread-${thread.id}`" class="thread-message mb-0 column is-12 columns is-gapless">
          <thread-message :proposal="proposal" :thread="thread" />
        </div>
        <div v-if="proposalThreads(proposal.id).length === 0" class="no-msg mt-6 has-text-centered">
           {{ $t('thread.no_messages') }}
        </div>
      </div>
      <div class="is-12 column">
        <form @submit.prevent="handleCreateMsg">
          <schema-form
            v-if="canWriteMsg"
            ref="msgForm"
            class="column is-12"
            :schema="schema"
            useCustomFormWrapper
            >
            <template #afterForm>
              <div class="buttons">
                <o-button :disabled="submitting || !submittable" class="new-msg-submit" variant="primary" native-type="submit">
                  <span>{{ $t('thread.submit') }}</span>
                </o-button>
              </div>
            </template>
          </schema-form>
        </form>
      </div>
    </div>
  </o-collapse>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

import { storeToRefs } from 'pinia'
        
import ThreadMessage from '@/components/threads/ThreadMessage.vue'

import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"
import { debounce } from '@/utils/shared'

import { useFormFields } from '@/composables/useFormFields.js'
import { useThreads } from '@/store/threads.js'
import { useUser } from '@/store/user.js'
const { canWriteSom, canWriteSomReview } = useUser()
const threadsStore = useThreads()
import { HTMLNotEmpty } from '@/utils/validations.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { createThread, getThreads } = threadsStore
const { proposalThreads } = storeToRefs(threadsStore)        

const THREADS_PER_REQUEST = 10

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  }
})

const submitting = ref(false)

const canWriteMsg = computed(() => {
  return canWriteSom(props.proposal.id) || canWriteSomReview(props.proposal.id)
})

const threadsScroll = ref(null)
const msgForm = ref(null)

const submittable = computed(() => {
  return HTMLNotEmpty(formData.value.text)
})

const initialSchema = ref({
  text: {
    type: 'html',
    label: t(`thread.text`),
    editorOptions: {
      modules: {
        keyboard: {
          bindings: {
            tab: {
              key: 13,
              handler: () => {
                if (submittable.value) {
                  handleCreateMsg()
                }
              }
            }
          }
        }
      }
    }
  }
})

let { schema, clearForm } = useFormFields(initialSchema.value)
const formData = ref({})
const { updateFormModel } = useSchemaForm(formData)
let SchemaForm = SchemaFormFactory([
  VeeValidatePlugin()
])

const handleCreateMsg = async () => {
  submitting.value = true
  const response =  await createThread({
    ...formData.value,
    proposal_id: props.proposal.id
  }, props.proposal)
  if (response) {
    await getThreads(props.proposal.id, 0, THREADS_PER_REQUEST)
    _clearForm()
  }
}

const _clearForm = () => {
  clearForm(formData, updateFormModel)
  submitting.value = false
}

const targetScroll = ref(0)
const scrollInteracted = ref(false)
const maxPage = ref(0)
const threadsNumber = computed(() => {
  if (props.proposal) {
    return proposalThreads.value(props.proposal.id).length
  }
  return 0
})

watch(threadsNumber, () => {
  nextTick(() => {
    if (!scrollInteracted.value) {
      threadsScroll.value.scrollTo(0, threadsScroll.value.scrollHeight)
    }
    
  })
})

const openCallback = () => {
  nextTick(() => {
    targetScroll.value = 0
    scrollInteracted.value = false
    threadsScroll.value.scrollTo(0, threadsScroll.value.scrollHeight)
  })
}

const handleScroll = debounce(async (e) => {
  targetScroll.value = 0
  if (e.target) {
    if (e.target.scrollTop === e.target.scrollHeight - e.target.clientHeight) {
      scrollInteracted.value = false
    } else {
      scrollInteracted.value = true
    }
    if (e.target.scrollTop <= 1) {
      const newMaxPage = maxPage.value + 1
      const oldScrollHeight = threadsScroll.value.scrollHeight
      const oldScrollPos = threadsScroll.value.scrollTop
      const result = await getThreads(props.proposal.id, newMaxPage, THREADS_PER_REQUEST)
      if (result > 0) {
        maxPage.value = newMaxPage
        const addedScroll = threadsScroll.value.scrollHeight - oldScrollHeight
        targetScroll.value = oldScrollPos + addedScroll
        if (targetScroll.value > 0) {
          threadsScroll.value.scrollTo(0, targetScroll.value)
        }
      }
    }
    
  }
}, 500)

const refreshTimeout = ref(null)

onMounted(async () => {
  setTimeout(async () => {
    await getThreads(props.proposal.id, 0, THREADS_PER_REQUEST)
  }, 1000)
  refreshTimeout.value = setInterval(async () => {
    await getThreads(props.proposal.id, 0, THREADS_PER_REQUEST)
  }, 30000)
})

</script>

<style lang="scss" scoped>

$primary: #133FF0;
.messages-container {
  width: 100%;
  height: 400px;
  overflow: auto;
}
.thread-header {
  background: change-color($primary, $lightness: 70%);
  .card-header-title {
    color: white;
  }
}
</style>