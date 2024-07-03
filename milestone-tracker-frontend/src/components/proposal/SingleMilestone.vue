<template>
  <div :id="`som-${milestone}`" class="content mb-0">
    <section class="section pt-0">
      <div class="columns">
        <div class="column is-8">
          <h2 v-if="milestone !== proposal.milestones_qty" class="is-size-3 mb-2 mt-2">{{ $t('milestone.som', {nr: milestone}) }}</h2>
          <h2 v-if="milestone === proposal.milestones_qty" class="is-size-3 mb-2 mt-2">{{ $t('milestone.final_som') }}</h2>
          <p class="mb-5">{{ $t('milestone.latest_som', {nr: milestone}) }}</p>
          <p v-if="withPoas">
            <router-link
              v-slot="{ navigate }"
              :to="{name: 'proposal-milestones-detail-section', params: {id: proposal.project_id, milestone: milestone, section: `poa-${milestone}`}}">
              <o-button variant="primary" size="medium" icon-right="arrow-down" @click="navigate" >
                {{ $t('milestone.jump_to_poa') }}
              </o-button>
            </router-link>
          </p>
          <p
            v-if="currentSom && currentSom.som_reviews.length > 0 && canSubmitSom && currentSomStatus"
            :class="{
              'is-danger': currentSomStatus === 'no_approvals',
              'is-success': currentSomStatus === 'all_approvals',
              'is-warning': currentSomStatus === 'some_approvals',
              'is-light': ['no_approvals', 'all_approvals'].includes(currentSomStatus)
            }"
            class="notification"
          >
            {{ $t(`milestone.${currentSomStatus}`) }}
          </p>
        </div>
        <div v-if="canSubmitSom" class="column is-4 has-text-right mt-4">
          <o-button
            class="new-som"
            size="medium"
            variant="primary"
            @click="_handleNewSom()">
            {{(currentSom) ? $t('milestone.resubmit_som') : $t('milestone.submit_new_som')}}
          </o-button>
        </div>
      </div>
    </section>
    <single-som
      :milestone="milestone"
      :som="currentSom"
      :proposal="proposal"
      :current="true"
      :other-milestones-soms="otherMilestonesSoms"
      />
    <section
      v-if="otherSoms.length > 0"
      class="section has-background-grey-lighter">
      <o-button
        size="medium"
        @click="othersVisible = !othersVisible">
        {{(othersVisible) ? $t('milestone.hide_archived_soms') : $t('milestone.show_archived_soms')}}
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
    <o-modal v-model:active="newVisible" width="900" :destroy-on-hide="false">
      <div class="block">
        <new-som
          :proposal="proposal"
          :milestone="props.milestone"
          :soms="otherMilestonesSoms"
          :som="currentSom"
          @som-submitted="newVisible = false"
          @refresh-recap="emit('refreshRecap')"
          />
      </div>
    </o-modal>
    <o-modal v-model:active="confirmResubmission">
      <resubmission-confirm
        :title="$t('milestone.resubmission_title')"
        :msg="$t('milestone.resubmission_msg')"
        :confirm-msg="$t('milestone.resubmission_confirm')"
        :clear-msg="$t('milestone.resubmission_clear')"
        @clear-confirm="confirmResubmission = false"
        @confirm="_handleResubmission()"
      />
    </o-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSoms } from '@/store/soms.js'
import { useUser } from '@/store/user.js'
import { canSubmitSomByChangeRequest } from '@/utils/milestones.js'
import useEventsBus from '@/eventBus'
const { getSoms, proposals } = useSoms()
const { canWriteSom } = useUser()
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

const emit = defineEmits(['refreshRecap'])

const othersVisible = ref(false)
const newVisible = ref(false)
const confirmResubmission = ref(false)

const _handleNewSom = () => {
  if (currentSom.value) {
    confirmResubmission.value = true
  } else {
    newVisible.value = true
  }
}

const _handleResubmission = () => {
  confirmResubmission.value = false
  newVisible.value = true
}

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

const currentSomStatus = computed(() => {
  try {
    if (currentSom.value.signoffs.length > 0) {
      return null
    } else if (currentSom.value.som_reviews.filter(r => r.current).length === 1 && currentSom.value.signoffs.length === 0) {
      return 'waiting_reviews'
    } else {
      const reviews = currentSom.value.som_reviews.filter(r => r.current).map((r) => (r.outputs_approves && r.evidence_approves && r.success_criteria_approves))
      if (reviews.every((r) => (r))) {
        return 'all_approvals'
      } else if (reviews.some((r) => (r))) {
        return 'some_approvals'
      } else {
        return 'no_approvals'
      }
    }
  } catch {
    return null
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
      (
        currentSom.value.signoffs?.length === 0 ||
        canSubmitSomByChangeRequest(props.proposal, currentSom.value)
      )
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
    getSoms(props.proposal.id, props.milestone, 10)
  }
})

watch(props, () => {
  getSoms(props.proposal.id, props.milestone, 10)
})

onMounted(async () => {
  getSoms(props.proposal.id, props.milestone, 10)
})

</script>

<script>
import SingleSom from '@/components/som/SingleSom.vue'
import NewSom from '@/components/forms/NewSom.vue'
import ResubmissionConfirm from '@/components/proposal/ResubmissionConfirm.vue'
</script>
