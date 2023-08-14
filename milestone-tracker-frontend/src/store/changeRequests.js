import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification, successNotification } from '@/utils/notifications'
// import useEventsBus from '@/eventBus'

// const { emit } = useEventsBus()

export const useChangeRequests = defineStore('change-requests-store', {
  state: () => {
    return {
      crs: {},
    }
  },

  getters: {
  },

  actions: {
    async createChangeRequest(cr) {
      try {
        const { error } = await supabase
          .from('change_request')
          .insert([cr])
        if (error) throw error
        successNotification(this.$i18n.t('change_requests.created'))
        return true
      } catch(error) {
        errorNotification(this.$i18n.t('errors.creating_change_request'))
      }
    },
  }
})
