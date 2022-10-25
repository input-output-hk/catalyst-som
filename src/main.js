import { createApp } from 'vue'
import { createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import Oruga from '@oruga-ui/oruga-next'

import createRouter from './router/routes.js'
import App from './App.vue'

import { bulmaConfig } from '@oruga-ui/theme-bulma'
import '@oruga-ui/theme-bulma/dist/bulma.css'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const store = createPinia()
store.use(piniaPluginPersistedstate)
const router = createRouter(createWebHistory())
const app = createApp(App)
const i18n = createI18n({
  locale: 'en',
  allowComposition: true
})

app.component('QuillEditor', QuillEditor)

app.use(Oruga, bulmaConfig)
  .use(router)
  .use(store)
  .use(i18n)
  .mount('#app')
