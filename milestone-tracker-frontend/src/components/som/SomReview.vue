<template>
  <table class="table is-bordered is-striped">
    <tr>
      <td>
        {{ $t('som_review.from')}} 
        <span class="has-text-weight-semibold">{{role}}</span> 
        <span v-if="identity" class="is-size-7">&nbsp;{{ identity }}</span>
      </td>
    </tr>
    <tr v-for="property in properties" :key="property">
      <td>
        <span class="is-size-5 has-text-weight-semibold" :class="`${property}_approves`">
          {{ (review[`${property}_approves`]) ? $t('som_review.approved') : $t('som_review.not_approved') }}
        </span>
        <div
          :class="`${property}_comment`"
          class="html-text"
          v-html="$sanitize(review[`${property}_comment`])" />
      </td>
    </tr>
    <tr>
      <td>
        {{ $t('som_review.submitted_at') }} <span class="has-text-weight-semibold">{{$d(review.created_at, 'long')}}</span>
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
  },
  properties: {
    type: Array,
    default: () => []
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
