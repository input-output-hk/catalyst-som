<template>
  <table class="table is-bordered is-striped">
    <tr>
      <td>From <span class="has-text-weight-semibold">{{role}}</span></td>
    </tr>
    <tr>
      <td>
        <span class="is-size-5 has-text-weight-semibold">{{ (review.content_approved) ? 'Approved' : 'Not Approved' }}</span>
        <div v-html="$sanitize(review.content_comment)" />
      </td>
    </tr>
    <tr>
      <td>
        Submitted at: <span class="has-text-weight-semibold">{{$d(review.created_at, 'long')}}</span>
      </td>
    </tr>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import { roles } from '@/utils/roles.js'
const props = defineProps(['review'])

const role = computed(() => roles[props.review.users.role])
</script>
