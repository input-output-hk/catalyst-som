<template>
  <section class="section">
    <div class="content">
      <h1 class="is-size-1">{{ $t('pages.admin.title') }}</h1>
      <p>{{ $t('pages.admin.description') }}</p>
      <p class="has-text-right">
        <new-user />
      </p>
      <paginated-table
        class-style="users-list"
        :headers="[
          $t('pages.admin.email'),
          $t('pages.admin.role'),
          $t('pages.admin.challenges'),
          $t('pages.admin.proposals_as_owner'),
          $t('pages.admin.proposals_allocated')
        ]"
        :items="users"
        :get-items="getUsers"
        :get-count="getCount"
        :item-component="UserItem"
      >
      </paginated-table>
    </div>
  </section>
</template>

<script setup>
import UserItem from '@/components/admin/UserItem.vue'
import PaginatedTable from '@/components/shared/PaginatedTable.vue'
import NewUser from '@/components/forms/NewUser.vue'
import { useUsers } from '@/store/users.js'
import { storeToRefs } from 'pinia'
const userStore = useUsers()
const { getUsers, getCount } = userStore
const { users } = storeToRefs(userStore)
</script>

<style lang="scss">
.users-list {
  thead {
    th:nth-child(1) {
      width: 16%
    }
    th:nth-child(2) {
      width: 10%
    }
    th:nth-child(3) {
      width: 10%
    }
    th:nth-child(4) {
      width: 26%
    }
    th:nth-child(5) {
      width: 26%
    }
  }
}
</style>
