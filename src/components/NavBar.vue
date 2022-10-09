<template>
  <nav class="navbar is-warning" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      Milestone Module
    </div>
    <div id="main-nav" class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/proposals">Proposals</router-link>
        <router-link class="navbar-item" to="/login" v-if="!logged">Login</router-link>
        <router-link class="navbar-item" to="/profile" v-if="logged">Profile</router-link>
      </div>
      <div class="navbar-end" v-if="logged">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-dark">
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
</script>

<script>
import { computed } from 'vue'
import { mapState, mapActions } from 'pinia'

export default {
  computed: {
    ...mapState(useUser, {user: 'user', logged: 'logged'})
  },

  methods: {
    ...mapActions(useUser, ['login', 'logout']),
  },

  created() {
  }
}
</script>
