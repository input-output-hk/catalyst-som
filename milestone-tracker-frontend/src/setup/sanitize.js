import Vue3Sanitize from "vue-3-sanitize"

const sanitizeOptions = {
    allowedTags: ['ul', 'li', 'a', 'ol', 'h1', 'h2', 'h3', 'strong', 'b', 'u', 'i'],
    allowedSchemes: ['http', 'https', 'mailto'],
}

export default function setupSanitize(app) {
  app.use(Vue3Sanitize, sanitizeOptions)
}
