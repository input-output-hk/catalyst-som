<template>
  <nav class="navbar is-primary has-text-weight-semibold" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <figure class="image p-3">
        <img class="logo" :src="logoUrl" :alt="$t('global.title')" />
      </figure>
      <a
        role="button"
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
        <router-link class="navbar-item" to="/projects">{{ $t('nav.proposals') }}</router-link>
        <router-link v-if="!logged" class="navbar-item" to="/login">{{ $t('nav.login') }}</router-link>
        <router-link v-if="logged" class="navbar-item" to="/profile">{{ $t('nav.profile') }}</router-link>
        <router-link v-if="logged" class="navbar-item" to="/notifications">{{ $t('nav.to_do_list_updates') }}</router-link>
        <router-link v-if="canSetAllocations" class="navbar-item" to="/latest-submissions">{{ $t('nav.latest_submissions') }}</router-link>
        <router-link v-if="isAdmin" class="navbar-item" to="/funding">{{ $t('nav.funding') }}</router-link>
        <router-link v-if="isAdmin" class="navbar-item" to="/admin">{{ $t('nav.admin') }}</router-link>
      </div>
      <div v-if="logged" class="navbar-end">
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
import logoUrl from '@/assets/images/catalyst-logo-white.svg'
const userStore = useUser()
const { logout, initUser } = userStore
const { user, logged, isAdmin, canSetAllocations } = storeToRefs(userStore)

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
