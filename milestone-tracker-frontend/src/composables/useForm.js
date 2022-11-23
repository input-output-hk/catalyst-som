import { reactive } from 'vue'

export function useForm(initialForm) {
  const form = reactive({...initialForm})

  const _clearForm = () => {
    Object.assign(form, initialForm)
  }

  return {
    form,
    _clearForm
  }
}
