<template>
  <div class="content mb-0">
    <section class="section pt-0">
      <div class="columns">
        <div class="column is-8">
          <h2 class="is-size-3 mb-2 mt-2">Statement of Milestone {{milestone}}</h2>
          <p class="mb-5">Latest submission from proposers of the Statement of Milestone {{milestone}}.</p>
        </div>
        <div class="column is-4 has-text-right mt-4" v-if="canSubmitSom">
          <o-button
            size="medium"
            variant="primary"
            @click="newVisible = !newVisible">
            {{(newVisible) ? 'Hide submit new SoMs' : 'Submit new SoM'}}
          </o-button>
        </div>
      </div>
    </section>
    <som
      :milestone="milestone"
      :som="currentSom"
      :proposal="proposal"
      :current="true" />
    <section class="section has-background-grey-lighter"
      v-if="otherSoms.length > 0">
      <o-button
        size="medium"
        @click="othersVisible = !othersVisible">
        {{(othersVisible) ? 'Hide archived SoMs' : 'Show archived SoMs'}}
      </o-button>
      <div v-if="othersVisible">
        <h3 class="mt-6 subtitle">Archived Statements of Milestone {{milestone}}</h3>
        <som
          :current="false"
          :som="som"
          :proposal="proposal"
          v-for="som in otherSoms" />
      </div>
    </section>
    <o-modal v-model:active="newVisible" width="900">
      <div class="block">
        <new-som
          :proposal="proposal"
          :milestone="props.milestone"
          :som="currentSom"
          @som-submitted="newVisible = false"
          />
      </div>
    </o-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useSoms } from '@/store/soms.js'
const { getSoms, proposals } = useSoms()
import { useUser } from '@/store/user.js'
const { canWriteSom } = useUser()
const props = defineProps(['proposal', 'milestone'])
import { computedAsync } from '@vueuse/core'
import useEventsBus from '@/eventBus'
const { bus } = useEventsBus()

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
  if (soms.value) {
    const [, ...rest] = soms.value
    return rest
  }
  return []
})

const currentSom = computed(() => {
  if (soms.value) {
    return (soms.value.length > 0) ? soms.value[0] : false
  }
  return false
})

const canSubmitSom = computed(() => {
  if (currentSom.value) {
    return (
      canWriteSom(props.proposal.id) &&
      currentSom.value.signoffs.length === 0
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
import Som from '@/components/Som.vue'
import NewSom from '@/components/forms/NewSom.vue'
</script>
