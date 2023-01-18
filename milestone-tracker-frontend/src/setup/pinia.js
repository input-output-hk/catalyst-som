import { markRaw } from 'vue'
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

export default function setupPinia(app, router, i18n) {
  const store = createPinia()
  store.use(piniaPluginPersistedstate)
  store.use(({ store }) => {
    store.$router = markRaw(router)
    store.$i18n = markRaw(i18n)
  })
  app.use(store)
}
