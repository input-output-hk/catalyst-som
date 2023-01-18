import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification, successNotification } from '@/utils/notifications'
import useEventsBus from '@/eventBus'

const { emit } = useEventsBus()

export const usePoas = defineStore('poas-store', {
  state: () => {
    return {
      proposals: {},
    }
  },

  getters: {
  },

  actions: {
    async createPoa(poa, som) {
      try {
        const { data, error } = await supabase
          .from('poas')
          .insert([poa])
          .select()
        if (error) throw error
        successNotification(this.$i18n.t('notifications.poa_created'))
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        console.log(error)
        errorNotification(this.$i18n.t('errors.creating_poa'))
      }
    },
  }
})
