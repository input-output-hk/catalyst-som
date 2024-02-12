<template>
  <div class="message mb-0 column is-10" :class="{'my-msg': isOwnMessage, 'is-link': isOwnMessage}">
    <header class="message-header">
      <p>
        {{ sender }}
      </p>
    </header>
    <div class="message-body">
      <div
        class="thread-message html-text"
        v-html="$sanitize(thread.text)" />
        <time class="is-size-7 has-text-grey-light" :datetime="thread.created_at">{{$d(thread.created_at, 'long')}}</time>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { roles } from '@/utils/roles.js'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useUser } from '@/store/user.js'
const userStore = useUser()
const { user } = storeToRefs(userStore)
const { t } = useI18n()

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
  thread: {
    type: Object,
    default: () => {}
  }
})

const isOwnMessage = computed(() => {
  return props.thread.user_id === user.value.id
})

const proposersIds = computed(() => {
  return props.proposal.proposals_users.map(pu => pu.user_id)
})

const reviewersIds = computed(() => {
  return props.proposal.allocations.map(a => a.user_id)
})

const signoffIds = computed(() => {
  return props.proposal.allocations_signoff.map(a => a.user_id)
})

const reviewerId = computed(() => {
  if (reviewersIds.value.includes(props.thread.user_id)) {
    return props.proposal.allocations.map(a => a.user_id).indexOf(props.thread.user_id)
  }
  return null
})

const sender = computed(() => {
  if (proposersIds.value.includes(props.thread.user_id)) {
    return t(`roles.${roles[0]}`)
  } else if (reviewersIds.value.includes(props.thread.user_id)) {
    return t(`roles.${roles[1]}`) + ` ${reviewerId.value}`
  } else if (signoffIds.value.includes(props.thread.user_id)) {
    return t(`roles.${roles[4]}`)
  } else {
    return t('som_review.system')
  }
})

</script>

<style lang="scss" scoped>
.my-msg {
  margin-left: 16.66666674% !important;
}
.message-body {
  padding: 0.75em 1em;
}
</style>