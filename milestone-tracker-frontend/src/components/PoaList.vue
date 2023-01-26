<template>
  <div class="content mb-0">
    <section class="section has-background-white-ter">
      <h3 class="subtitle">{{ $t('poas.title') }}</h3>
      <poa-single
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
  }
})

const othersVisible = ref(false)

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
import PoaSingle from '@/components/PoaSingle.vue'
</script>
