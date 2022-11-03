<template>
  <table class="table is-bordered is-striped">
    <tr>
      <td>From Challenge Team / IOG</td>
    </tr>
    <tr v-for="property in properties">
      <td>
        <o-checkbox v-model="review[`${property}_approves`]" disabled>
          Approved
        </o-checkbox>
        <div v-html="review[`${property}_comment`]" />
      </td>
    </tr>
    <tr>
      <td>
        Submitted at: {{$d(review.created_at, 'long')}}
      </td>
    </tr>
  </table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['review', 'properties'])
</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>
