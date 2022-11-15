<template>
  <table class="table is-bordered is-striped">
    <tr>
      <td>From <span class="has-text-weight-semibold">{{role}}</span></td>
    </tr>
    <tr v-for="property in properties">
      <td>
        <span class="is-size-5 has-text-weight-semibold">{{ (review[`${property}_approves`]) ? 'Approved' : 'Not Approved' }}</span>
        <div v-html="$sanitize(review[`${property}_comment`])" />
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
const props = defineProps(['review', 'properties'])

const role = computed(() => {
  if (props.review.users) {
    return roles[props.review.users.role]
  }
  return 'System'
})

</script>
