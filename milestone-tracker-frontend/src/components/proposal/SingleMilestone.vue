<template>
  <div class="content mb-0">
    <section class="section pt-0">
      <div class="columns">
        <div class="column is-8">
          <h2 class="is-size-3 mb-2 mt-2">{{ $t('milestone.som', {nr: milestone}) }}</h2>
          <p class="mb-5">{{ $t('milestone.latest_som', {nr: milestone}) }}</p>
          <p v-if="withPoas">
            <router-link :to="{name: 'proposal-milestones-detail-section', params: {id: proposal.id, milestone: milestone, section: `poa-${milestone}`}}">
              Jump to PoA
            </router-link>
          </p>
        </div>
        <div v-if="canSubmitSom" class="column is-4 has-text-right mt-4">
          <o-button
            class="new-som"
            size="medium"
            variant="primary"
            @click="newVisible = !newVisible">
            {{(newVisible) ? 'Hide submit new SoMs' : 'Submit new SoM'}}
          </o-button>
        </div>
      </div>
    </section>
    <single-som
      :milestone="milestone"
      :som="currentSom"
      :proposal="proposal"
      :current="true" />
    <section
      v-if="otherSoms.length > 0"
      class="section has-background-grey-lighter">
      <o-button
        size="medium"
        @click="othersVisible = !othersVisible">
        {{(othersVisible) ? 'Hide archived SoMs' : 'Show archived SoMs'}}
      </o-button>
      <div v-if="othersVisible">
        <h3 class="mt-6 subtitle">{{ $t('milestone.archived', {nr: milestone}) }}</h3>
        <single-som
          v-for="som in otherSoms"
          :key="som.id"
          :current="false"
          :som="som"
          :proposal="proposal" />
      </div>
    </section>
    <o-modal v-model:active="newVisible" width="900">
      <div class="block">
        <new-som
          :proposal="proposal"
          :milestone="props.milestone"
          :soms="otherMilestonesSoms"
          :som="currentSom"
          @som-submitted="newVisible = false"
          />
      </div>
    </o-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSoms } from '@/store/soms.js'
const { getSoms, proposals } = useSoms()
import { useUser } from '@/store/user.js'
const { canWriteSom } = useUser()
import useEventsBus from '@/eventBus'
const { bus } = useEventsBus()

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
  milestone: {
    type: Number,
    default: 0
  }
})

const othersVisible = ref(false)
const newVisible = ref(false)

const soms = computed(() => {
  try {
    return proposals[props.proposal.id][props.milestone]
  } catch {
    return []
  }
})

const otherSoms = computed(() => {
  try {
    return soms.value.filter(som => !som.current)
  } catch {
    return []
  }
})

const currentSom = computed(() => {
  try {
    return soms.value.find(som => som.current)
  } catch {
    return null
  }
})

const withPoas = computed(() => {
  try {
    return (currentSom.value.poas.length > 0)
  } catch {
    return false
  }
})

const otherMilestonesSoms = computed(() => {
  try {
    return Object.values(proposals[props.proposal.id]).map(
      (soms) => (soms.length > 0) ? soms.find(som => som.current) : null
    )
  } catch {
    return []
  }
})

const canSubmitSom = computed(() => {
  if (currentSom.value) {
    return (
      canWriteSom(props.proposal.id) &&
      currentSom.value.signoffs?.length === 0
    )
  }
  return canWriteSom(props.proposal.id)
})

watch(()=>bus.value.get('getSomsBus'), (val) => {
  // destruct the parameters
  const [getSomsBus] = val ?? []
  getSomsBus.value = getSomsBus
  if (
    (getSomsBus.value.proposal_id === props.proposal.id) &&
    (getSomsBus.value.milestone === props.milestone)
  ) {
    getSoms(props.proposal.id, props.milestone, 5)
  }
})

watch(props, () => getSoms(props.proposal.id, props.milestone, 5))

</script>

<script>
import SingleSom from '@/components/som/SingleSom.vue'
import NewSom from '@/components/forms/NewSom.vue'
</script>
