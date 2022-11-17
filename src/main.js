import { createApp } from 'vue'
import { createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from 'vue-i18n'
import Oruga from '@oruga-ui/oruga-next'

import createRouter from '@/router/routes.js'
import App from '@/App.vue'

import { bulmaConfig } from '@oruga-ui/theme-bulma'
import '@/assets/sass/main.scss'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import Vue3Sanitize from "vue-3-sanitize";

const store = createPinia()
store.use(piniaPluginPersistedstate)
const router = createRouter(createWebHistory())
const app = createApp(App)
const i18n = createI18n({
  locale: 'en',
  allowComposition: true,
  numberFormats: {
    "en": {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
  },
  datetimeFormats: {
    "en": {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
})

const sanitizeOptions = {
    allowedTags: ['ul', 'li', 'a', 'ol', 'h1', 'h2', 'h3', 'strong', 'b', 'u', 'i'],
    allowedSchemes: ['http', 'https', 'mailto'],
}

app.component('QuillEditor', QuillEditor)

app.use(Oruga, bulmaConfig)
  .use(router)
  .use(store)
  .use(i18n)
  .use(Vue3Sanitize, sanitizeOptions)
  .mount('#app')
