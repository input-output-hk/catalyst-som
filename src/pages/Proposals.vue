<template>
  <div class="content">
    <h1 class="is-size-1">Proposals</h1>
    <p>All the proposals in the Statement of Milestone pilot.</p>
    <div class="table-container">
      <table class="table is-bordered is-striped">
        <thead>
          <tr>
            <th><abbr title="Project ID">ID</abbr></th>
            <th>Title</th>
            <th>Challenge</th>
            <th>Budget</th>
            <th class="small-col">SoM?</th>
            <th class="small-col">SoM OK?</th>
            <th class="small-col">PoA?</th>
            <th class="small-col">PoA OK?</th>
          </tr>
        </thead>
        <tbody>
          <proposal-row :proposal="proposal" v-for="proposal in proposals" />
        </tbody>
      </table>
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
import ProposalRow from '../components/ProposalRow.vue'

export default {
  components: {
    ProposalPreview,
    ProposalRow
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

<style lang="scss" scoped>
.small-col {
  width: 4rem;
}
</style>
