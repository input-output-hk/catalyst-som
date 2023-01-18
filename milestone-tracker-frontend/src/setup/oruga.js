import Oruga from '@oruga-ui/oruga-next'

import { bulmaConfig } from '@oruga-ui/theme-bulma'

export default function setupOruga(app) {
  app.use(
    Oruga,
    {
      ...bulmaConfig,
      iconComponent: 'vue-fontawesome',
      iconPack: "fas"
    }
  )
}
