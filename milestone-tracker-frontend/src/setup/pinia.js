import { markRaw } from 'vue'
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

export default function setupPinia(app, router) {
  const store = createPinia()
  store.use(piniaPluginPersistedstate)
  store.use(({ store }) => {
    store.$router = markRaw(router)
  })
  app.use(store)
}
