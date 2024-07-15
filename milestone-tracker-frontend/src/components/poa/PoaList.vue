<template>
  <div class="content mb-0">
    <section class="section has-background-white-ter">
      <h3 class="subtitle">{{ $t('poas.title') }}</h3>
      <p
        v-if="renderedPoas.current && renderedPoas.current.poas_reviews.length > 0 && submittablePoa"
        :class="{
          'is-danger': currentPoaStatus === 'no_approvals',
          'is-success': currentPoaStatus === 'all_approvals',
          'is-warning': currentPoaStatus === 'some_approvals',
          'is-light': ['no_approvals', 'all_approvals'].includes(currentPoaStatus)
        }"
        class="notification"
      >
        {{ $t(`poa.${currentPoaStatus}`) }}
      </p>
    
      <poa-single
        class="current-poa"
        :is-previous-poa-signed-off="isPreviousPoaSignedOff"
        :current="true"
        :poa="renderedPoas.current"
        :som="som"
        :proposal="proposal" />
      <o-button
        v-if="renderedPoas.others.length > 0"
        class="mt-6"
        size="medium"
        @click="othersVisible = !othersVisible">
        {{(othersVisible) ? $t('poas.hide_archived') : $t('poas.show_archived')}}
      </o-button>
    </section>
    <section v-if="othersVisible" class="section has-background-grey-light">
      <h3 class="subtitle">{{ $t('poas.archived') }}</h3>
      <poa-single
        v-for="poa in renderedPoas.others"
        :key="poa.id"
        :current="false"
        :poa="poa"
        :som="som"
        :proposal="proposal" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  poas: {
    type: Array,
    default: () => []
  },
  proposal: {
    type: Object,
    default: () => {}
  },
  som: {
    type: Object,
    default: () => {}
  },
  submittablePoa: {
    type: Boolean,
    default: false
  },
  isPreviousPoaSignedOff: {
    type: Boolean,
    default: false
  }
})

const othersVisible = ref(false)

const currentPoaStatus = computed(() => {
  try {
    if (renderedPoas.value.current.poas_reviews.length === 1) {
      return 'waiting_reviews'
    } else {
      const reviews = renderedPoas.value.current.poas_reviews.filter((r) => r.current).map((r) => (r.content_approved))
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

const renderedPoas = computed(() => {
  let current = false
  let others = []
  if (props.poas) {
    [current, ...others] = props.poas
  }
  return {
    current,
    others
  }
})

</script>

<script>
import PoaSingle from '@/components/poa/PoaSingle.vue'
</script>
