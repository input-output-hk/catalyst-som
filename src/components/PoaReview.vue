<template>
  <div class="block mb-5">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          Review from --
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="block">
            <p>
              <o-checkbox v-model="review.content_approved" disabled>
                Approved
              </o-checkbox>
            </p>
            {{ review.content_comment }}
          </div>
          <div class="block">
            Sumbitted at: {{$d(review.created_at)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['review'])
</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>
