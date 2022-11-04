<template>
  <nav class="navbar is-primary has-text-weight-semibold" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <figure class="image p-3">
        <img class="logo" :src="logoUrl" alt="Project Catalyst Milestone Module" />
      </figure>
    </div>
    <div id="main-nav" class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/proposals">Proposals</router-link>
        <router-link class="navbar-item" to="/login" v-if="!logged">Login</router-link>
        <router-link class="navbar-item" to="/profile" v-if="logged">Profile</router-link>
        <router-link class="navbar-item" to="/admin" v-if="isAdmin">Admin</router-link>
      </div>
      <div class="navbar-end" v-if="logged">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-white">
              <span @click="logout">Logout {{user.email}}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUser } from '../store/user.js'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/images/catalyst-logo-white.svg'
const { canWriteSom } = useUser()
</script>

<script>
import { computed } from 'vue'
import { mapState, mapActions } from 'pinia'

export default {
  computed: {
    ...mapState(useUser, {user: 'user', logged: 'logged', isAdmin: 'isAdmin'})
  },

  methods: {
    ...mapActions(useUser, ['login', 'logout']),
  },

  created() {
  }
}
</script>

<style lang="scss" scoped>
  .logo {
    max-height: 2.5rem;
  }
</style>
