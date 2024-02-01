<template>
  <table class="table is-bordered is-striped">
    <tr>
      <td>
        {{$t('poa_review.from')}} <span class="has-text-weight-semibold">{{role}}</span>
        <span v-if="identity" class="is-size-7">&nbsp;{{ identity }}</span>
      </td>
    </tr>
    <tr>
      <td>
        <span class="is-size-5 has-text-weight-semibold">{{ (review.content_approved) ? 'Approved' : 'Not Approved' }}</span>
        <div class="poa-review-content html-text" v-html="$sanitize(review.content_comment)" />
      </td>
    </tr>
    <tr>
      <td>
        {{$t('poa_review.submitted_at')}} <span class="has-text-weight-semibold">{{$d(review.created_at, 'long')}}</span>
      </td>
    </tr>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { roles } from '@/utils/roles.js'
import { useUser } from '@/store/user.js'
const { t } = useI18n()

const { user } = storeToRefs(useUser())

const props = defineProps({
  review: {
    type: Object,
    default: () => {}
  }
})

const identity = computed(() => {
  if (props.review.users) {
    if (props.review.users.email === user.value.email) {
      return t('som_review.you')
    }
    return `(${props.review.users.email})`
  }
  return null
})

const role = computed(() => {
  if (props.review.role === undefined) {
    return t('som_review.system')
  }
  if (props.review.role <= 1) {
    return t(`roles.${roles[1]}`)
  } else if (props.review.role > 1) {
    return t(`roles.${roles[2]}`)
  }
  return t('som_review.system')
})
</script>
