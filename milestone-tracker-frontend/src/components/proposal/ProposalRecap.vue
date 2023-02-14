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
import AllocationForm from '@/components/proposal/AllocationForm.vue'
import { useUser } from '@/store/user.js'
defineProps({
  proposal: {
    type: Object,
    default: () => {}
  }
})
const { canSetAllocations } = useUser()

</script>
