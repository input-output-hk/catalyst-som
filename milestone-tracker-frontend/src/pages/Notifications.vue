<template>
  <section class="section">
    <div class="content">
      <h2>SoM to be reviewed</h2>
      <table class="table is-bordered is-striped" v-if="somsToReview.length > 0">
        <thead>
          <tr>
            <th v-for="header in headers">{{header}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in somsToReview">
            <td>{{ item.title }}</td>
            <td>{{ item.milestone }}</td>
            <td>{{$d(item.created_at, 'long')}}</td>
            <td>
              <router-link :to="{name: 'proposal-milestones-detail', params: {id: item.project_id, milestone: item.milestone}}">
                {{ $t('pages.notifications.go_to_milestone') }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <p>{{ $t('pages.notifications.no_soms_to_review') }}</p>
    </div>
    <div class="content">
      <h2>PoA to be reviewed</h2>
      <table class="table is-bordered is-striped" v-if="poasToReview.length > 0">
        <thead>
          <tr>
            <th v-for="header in headers">{{header}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in poasToReview">
            <td>{{ item.title }}</td>
            <td>{{ item.milestone }}</td>
            <td>{{$d(item.created_at, 'long')}}</td>
            <td>
              <router-link :to="{name: 'proposal-milestones-detail', params: {id: item.project_id, milestone: item.milestone}}">
                {{ $t('pages.notifications.go_to_poa') }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <p>{{ $t('pages.notifications.no_poas_to_review') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSoms } from '@/store/soms.js'
import { usePoas } from '@/store/poas.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { getSomsByAllocation } = useSoms()
const { getPoasByAllocation } = usePoas()

const soms = ref([])
const poas = ref([])

const headers = ref([
  t('pages.notifications.proposal'),
  t('pages.notifications.milestone'),
  t('pages.notifications.submitted_at'),
  ''
])

const somsToReview = computed(() => {
  return soms.value.filter(som => som.my_reviews_count === 0)
})

const poasToReview = computed(() => {
  return poas.value.filter(poa => poa.my_reviews_count === 0)
})

onMounted(async () => {
  soms.value = await getSomsByAllocation()
  // draft
  poas.value = []
})

</script>
