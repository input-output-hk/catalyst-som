import { QuillEditor } from '@vueup/vue-quill'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function setupComponents(app) {
  app.component('QuillEditor', QuillEditor)
  app.component('vue-fontawesome', FontAwesomeIcon)
}
