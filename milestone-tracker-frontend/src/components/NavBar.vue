<template>
  <nav class="navbar is-primary has-text-weight-semibold" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <figure class="image p-3">
        <img class="logo" :src="logoUrl" :alt="$t('global.title')" />
      </figure>
      <a role="button"
        class="navbar-burger"
        :class="{'is-active': navActive}"
        aria-label="menu"
        aria-expanded="false"
        @click="toggleNav">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="main-nav" class="navbar-menu" :class="{'is-active': navActive}">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">{{ $t('nav.home') }}</router-link>
        <router-link class="navbar-item" to="/proposals">{{ $t('nav.proposals') }}</router-link>
        <router-link class="navbar-item" to="/login" v-if="!logged">{{ $t('nav.login') }}</router-link>
        <router-link class="navbar-item" to="/profile" v-if="logged">{{ $t('nav.profile') }}</router-link>
        <router-link class="navbar-item" to="/notifications" v-if="logged">{{ $t('nav.notifications') }}</router-link>
        <router-link class="navbar-item" to="/admin" v-if="isAdmin">{{ $t('nav.admin') }}</router-link>
      </div>
      <div class="navbar-end" v-if="logged">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-white">
              <span class="logout" @click="logout">{{ $t('nav.logout', {name: user.email}) }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUser } from '@/store/user.js'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/images/catalyst-logo-white.svg'
const userStore = useUser()
const { canWriteSom, login, logout, initUser } = userStore
const { user, logged, isAdmin } = storeToRefs(userStore)

const navActive = ref(false)

const toggleNav = () => {
  navActive.value = !navActive.value
}

onMounted(async () => {
  await initUser()
})
</script>

<style lang="scss" scoped>
  .logo {
    max-height: 1.8rem;
  }
</style>
