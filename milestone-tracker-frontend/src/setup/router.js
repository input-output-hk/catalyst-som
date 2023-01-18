import { createWebHistory } from "vue-router"

import createRouter from '@/router/routes.js'

const router = createRouter(createWebHistory())

export default function setupRouter(app) {
  app.use(router)
  return router
}
