import { createI18n } from 'vue-i18n'

export default function setupI18n(app) {
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
  app.use(i18n)
}
