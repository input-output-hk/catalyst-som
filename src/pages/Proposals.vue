<template>
  <div class="content">
    <div class="col-6 form-widget">
      <h1>Proposals</h1>
      <proposal-preview
        :proposal="proposal"
        v-for="proposal in proposals" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProposals } from '../store/proposals.js'
const { getProposals } = useProposals()

onMounted(() => {
  getProposals()
})

</script>

<script>
import { computed } from 'vue'
import { mapState } from 'pinia'
import ProposalPreview from '../components/ProposalPreview.vue'

export default {
  components: {
    ProposalPreview
  },
  computed: {
    ...mapState(useProposals, {
      proposals: 'proposals'
    }),
  },

  created() {
  }
}
</script>
