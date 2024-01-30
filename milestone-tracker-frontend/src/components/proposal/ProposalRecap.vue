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
            {{ $n(proposal.budget, "currency", { currency: proposal.currency }) }}
          </span>
        </td>
      </tr>

      <tr v-if="budgetError > 0" class="is-error">
        <th>{{ $t('proposal_recap.allocated_budget_error') }}</th>
        <td>
          <span>
            {{ $n(budgetError, "currency", { currency: proposal.currency }) }}
          </span>
        </td>
      </tr>
      <tr>
        <th>{{ $t('proposal_recap.funds_distributed') }}</th>
        <td>
          <span v-if="proposal.currency">
            {{ $n((proposal.funds_distributed || 0), "currency", { currency: proposal.currency }) }}
          </span>
        </td>
      </tr>
      <tr>
        <th>{{ proposal.funds_distributed === 0 ? $t('proposal_recap.scheduled_starting_date') : $t('proposal_recap.starting_date') }}</th>
        <td>
          <span v-if="proposal.starting_date">
            {{ $d(proposal.starting_date, 'short') }}
          </span>
        </td>
      </tr>
      <tr v-if="canSetAllocations">
        <th>{{ $t('proposal_recap.proposer_ownership') }}</th>
        <td><allocation-form :proposal="proposal" :allocation-type="'proposers'" /></td>
      </tr>
      <tr v-if="canSetAllocations">
        <th>{{ $t('proposal_recap.reviewers_allocations') }}</th>
        <td><allocation-form :proposal="proposal" /></td>
      </tr>
      <tr v-if="canSetAllocations">
        <th>{{ $t('proposal_recap.signoffs_allocations') }}</th>
        <td><allocation-form :proposal="proposal" :allocation-type="'signoffs'" /></td>
      </tr>
      <tr v-if="proposal.change_request?.length > 0 || canSetChangeRequests">
        <th>{{ $t('proposal_recap.change_request') }}</th>
        <td>
          <proposal-change-requests :proposal="proposal" :can-set-change-requests="canSetChangeRequests" />
        </td>
      </tr>
      <tr v-if="proposal.status > 0">
        <th>{{ $t('proposal_recap.status') }}</th>
        <td>
          {{ $t(`proposal_recap.statuses.${proposalStatuses[proposal.status]}`) }}
        </td>
      </tr>
    </tbody>
  </table>
  <o-modal class="budget-error" :active="budgetError > 0 && !dismissed && canWriteSom(proposal.id)" scroll="keep">
    <div class="card">
      <header class="card-header is-error is-light">
        <p class="card-header-title">
          {{ $t('proposal_recap.budget_error') }}
        </p>
      </header>
      <div class="card-content">
        <p>
          {{ $t(
              'proposal_recap.budget_error_msg',
              {
                allocated: $n(budgetError, "currency", { currency: proposal.currency }),
                total: $n(proposal.budget, "currency", { currency: proposal.currency })
              }
            )
          }}
        </p>
        <div class="buttons">
          <o-button
            size="medium"
            @click="dismissed = true">
            {{ $t('proposal_recap.ok') }}
          </o-button>
        </div>
      </div>
    </div>
  </o-modal>
</template>

<script setup>
import { computed, ref } from 'vue'
import AllocationForm from '@/components/proposal/AllocationForm.vue'
import ProposalChangeRequests from '@/components/proposal/ProposalChangeRequests.vue'
import { useUser } from '@/store/user.js'
import { proposalStatuses } from '@/utils/proposalStatuses.js'

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

const dismissed = ref(false)

const { canSetAllocations, canWriteSom, canSetChangeRequests } = useUser()

</script>

<style lang="scss" scoped>
.is-error {
  background: #EC4699;
  color: #fff;
}
</style>