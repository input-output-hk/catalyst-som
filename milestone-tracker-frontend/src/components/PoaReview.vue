<template>
  <table class="table is-bordered is-striped">
    <tr>
      <td>{{$t('poa_review.from')}} <span class="has-text-weight-semibold">{{role}}</span></td>
    </tr>
    <tr>
      <td>
        <span class="is-size-5 has-text-weight-semibold">{{ (review.content_approved) ? 'Approved' : 'Not Approved' }}</span>
        <div v-html="$sanitize(review.content_comment)" />
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
import { useI18n } from 'vue-i18n'
import { roles } from '@/utils/roles.js'
const { t } = useI18n()
const props = defineProps({
  review: {
    type: Object,
    default: () => {}
  }
})

const role = computed(() => t(`roles.${roles[props.review.role]}`))
</script>
