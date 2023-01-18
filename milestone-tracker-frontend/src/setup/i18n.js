import { createI18n } from 'vue-i18n'

import messages from '@/locales/messages/index.js'
import numberFormats from '@/locales/numbers/index.js'
import datetimeFormats from '@/locales/datetime/index.js'

export default function setupI18n(app) {
  const i18n = createI18n({
    locale: 'en',
    allowComposition: true,
    messages,
    numberFormats,
    datetimeFormats
  })
  app.use(i18n)
}
