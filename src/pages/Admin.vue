<template>
  <div class="content">
    <h1 class="subtitle">Admin</h1>
    <div class="col-6 form-widget">
      <ul>
        <user-item v-for="u in users" :user="u"></user-item>
      </ul>
    </div>
    <o-pagination
      :total="count"
      v-model:current="page"
      :per-page="size"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
    </o-pagination>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import UserItem from '../components/admin/UserItem.vue'
import { useUsers } from '../store/users.js'
import { storeToRefs } from 'pinia'
const userStore = useUsers()
const { getUsers, getCount } = userStore
const { users, count } = storeToRefs(userStore);

const size = ref(3)
const page = ref(1)

const _getUsers = () => {
  getUsers(page.value - 1, size.value)
}

watch(page, (val) => {
  _getUsers()
})

onMounted(() => {
  getCount()
  _getUsers()
})

</script>
