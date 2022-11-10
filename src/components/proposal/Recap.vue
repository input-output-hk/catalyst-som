<template>
  <table class="table is-bordered is-striped">
    <tbody>
      <tr>
        <th>Proposal ID</th>
        <td>{{proposal.project_id}}</td>
      </tr>
      <tr>
        <th>Link</th>
        <td>
          <a :href="proposal.url" target="_blank">Open in Ideascale</a>
        </td>
      </tr>
      <tr>
        <th>Challenge</th>
        <td>
          <span v-if="proposal.challenges">
            {{proposal.challenges.title}}
          </span>
        </td>
      </tr>
      <tr>
        <th>Budget</th>
        <td>
          <span v-if="proposal.budget">
            {{ $n(proposal.budget, "currency") }}
          </span>
        </td>
      </tr>
      <tr>
        <th>Completion date</th>
        <td>
          <span v-if="proposal.completion_date">
            {{ $d(proposal.completion_date, 'short') }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps(['proposal'])

</script>
