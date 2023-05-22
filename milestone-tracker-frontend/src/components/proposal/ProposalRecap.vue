<template>
  <table class="table is-bordered is-striped">
    <tbody>
      <tr>
        <th>{{ $t('proposal_recap.proposal_id') }}</th>
        <td>{{proposal.project_id}}</td>
      </tr>
      <tr>
        <th>{{ $t('proposal_recap.link') }}</th>
        <td>
          <a :href="proposal.url" target="_blank">{{ $t('proposal_recap.open_ideascale') }}</a>
        </td>
      </tr>
      <tr>
        <th>{{ $t('proposal_recap.challenge') }}</th>
        <td>
          <span v-if="proposal.challenges">
            {{proposal.challenges.title}}
          </span>
        </td>
      </tr>
      <tr>
        <th>{{ $t('proposal_recap.budget') }}</th>
        <td>
          <span v-if="proposal.budget">
            {{ $n(proposal.budget, "currency") }}
          </span>
        </td>
      </tr>
      <tr v-if="budgetError > 0" class="is-error">
        <th>{{ $t('proposal_recap.allocated_budget_error') }}</th>
        <td>
          <span>
            {{ $n(budgetError, "currency") }}
          </span>
        </td>
      </tr>
      <tr>
        <th>{{ $t('proposal_recap.funds_distributed') }}</th>
        <td>
          <span>
            {{ $n((proposal.funds_distributed || 0), "currency") }}
          </span>
        </td>
      </tr>
      <tr>
        <th>{{ $t('proposal_recap.completion') }}</th>
        <td>
          <span v-if="proposal.completion_date">
            {{ $d(proposal.completion_date, 'short') }}
          </span>
        </td>
      </tr>
      <tr v-if="canSetAllocations">
        <th>Reviewers allocations</th>
        <td><allocation-form :proposal="proposal" /></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import AllocationForm from '@/components/proposal/AllocationForm.vue'
import { useUser } from '@/store/user.js'

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
  snapshot: {
    type: Object,
    default: () => {}
  }
})

const soms = computed(() => {
  return Object.values(props.snapshot)
})

const isSomSubmissionComplete = computed(() => {
  const milestones_qty = (props.proposal.milestones_qty) ? props.proposal.milestones_qty : 5
  return soms.value.length === milestones_qty
})

const budgetError = computed(() => {
  if (isSomSubmissionComplete.value) {
    const allocatedBudget = soms.value.map((som) => som.cost).reduce((a, b) => a + b, 0)
    if ((props.proposal.budget - allocatedBudget) > 0) {
      return allocatedBudget
    }
  }
  return 0
})

const { canSetAllocations } = useUser()

</script>

<style lang="scss" scoped>
.is-error {
  background: #EC4699;
  color: #fff;
}
</style>