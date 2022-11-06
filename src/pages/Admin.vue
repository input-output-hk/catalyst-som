<template>
  <div class="content">
    <h1 class="is-size-1">Admin</h1>
    <p>Page for the administration of users.</p>
    <paginated-table
      classStyle="users-list"
      :headers="['Email', 'Username', 'Role', 'Challenges', 'Proposals']"
      :items="users"
      :getItems="getUsers"
      :getCount="getCount"
      :itemComponent="UserItem"
    >
    </paginated-table>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import UserItem from '../components/admin/UserItem.vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import { useUsers } from '../store/users.js'
import { storeToRefs } from 'pinia'
const userStore = useUsers()
const { getUsers, getCount } = userStore
const { users } = storeToRefs(userStore);
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
