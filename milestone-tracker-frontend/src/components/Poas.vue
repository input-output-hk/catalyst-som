<template>
  <div class="content mb-0">
    <section class="section has-background-white-ter">
      <h3 class="subtitle">{{ $t('poas.title') }}</h3>
      <poa
        :current="true"
        :poa="renderedPoas.current"
        :som="som"
        :proposal="proposal" />
      <o-button
        class="mt-6"
        size="medium"
        v-if="renderedPoas.others.length > 0"
        @click="othersVisible = !othersVisible">
        {{(othersVisible) ? $t('poas.hide_archived') : $t('poas.show_archived')}}
      </o-button>
    </section>
    <section class="section has-background-grey-light" v-if="othersVisible">
      <h3 class="subtitle">{{ $t('poas.archived') }}</h3>
      <poa
        :current="false"
        :poa="poa"
        :som="som"
        :proposal="proposal"
        v-for="poa in renderedPoas.others" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps(['poas', 'proposal', 'som'])

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
import Poa from '@/components/Poa.vue'
</script>
