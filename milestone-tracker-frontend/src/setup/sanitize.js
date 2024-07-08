import Vue3Sanitize from "vue-3-sanitize"

const sanitizeOptions = {
  allowedTags: ['ul', 'li', 'a', 'ol', 'h1', 'h2', 'h3', 'strong', 'b', 'u', 'i', 'p'],
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedClasses: {
    'li': ['ql-indent-1', 'ql-indent-2', 'ql-indent-3', 'ql-indent-4', 'ql-indent-5', 'ql-indent-6'],
  },

}

export default function setupSanitize(app) {
  app.use(Vue3Sanitize, sanitizeOptions)
}
