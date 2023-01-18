import "./style"

import setupComponents from "./components"
import setupOruga from "./oruga"
import setupPinia from "./pinia"
import setupRouter from "./router"
import setupI18n from "./i18n"
import setupSanitize from "./sanitize"
import "./icons"

export default function setup(app) {
  setupComponents(app)
  setupOruga(app)
  const router = setupRouter(app)
  setupPinia(app, router)
  setupI18n(app)
  setupSanitize(app)
  return app
}
