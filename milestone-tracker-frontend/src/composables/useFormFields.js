import { computed, markRaw } from 'vue'
import * as yup from 'yup';

import FieldHtml from "@/components/forms/formFields/FieldHtml.vue"
import FieldInput from "@/components/forms/formFields/FieldInput.vue"
import FieldNumber from "@/components/forms/formFields/FieldNumber.vue"
import FieldSelect from "@/components/forms/formFields/FieldSelect.vue"
import FieldRange from "@/components/forms/formFields/FieldRange.vue"
import FieldCheckbox from "@/components/forms/formFields/FieldCheckbox.vue"

export function useFormFields(initialSchema) {
  markRaw(FieldHtml)
  markRaw(FieldInput)
  markRaw(FieldNumber)
  markRaw(FieldSelect)
  markRaw(FieldRange)
  markRaw(FieldCheckbox)

  const fieldsMap = {
    "string": {
      component: FieldInput,
      validations: yup.string().required(),
      def: ''
    },
    "number": {
      component: FieldNumber,
      validations: yup.number().required(),
      def: "0"
    },
    "range": {
      component: FieldRange,
      validations: yup.number().required().min(0).max(100),
      def: 0
    },
    "html": {
      component: FieldHtml,
      validations: yup.string().required(),
      def: ''
    },
    "select": {
      component: FieldSelect,
      validations: () => true,
      def: null
    },
    "checkbox": {
      component: FieldCheckbox,
      validations: () => true,
      def: false
    }
  }

  const schema = computed(() => {
    Object.keys(initialSchema).forEach((k) => {
      let field = initialSchema[k]
      let component = fieldsMap[field.type].component
      let validations = (field.validations) ? field.validations : fieldsMap[field.type].validations
      let def = (field.def) ? field.def : fieldsMap[field.type].def
      field.component = component
      field.validations = validations
      field.default = def
    })
    return initialSchema
  })

  return {
    schema
  }
}
