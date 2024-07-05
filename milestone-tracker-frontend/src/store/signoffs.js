import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification, successNotification } from '@/utils/notifications'
import useEventsBus from '@/eventBus'

const { emit } = useEventsBus()

export const useSignoffs = defineStore('signoffs-store', {
  state: () => {
    return {
      signoffs: {},
    }
  },

  getters: {
  },

  actions: {
    async createSignoff(signoff, som) {
      try {
        const { error } = await supabase
          .from('signoffs')
          .insert([signoff])
        if (error) throw error
        successNotification(this.$i18n.t('notifications.signoff_created'))
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return true
      } catch(error) {
        errorNotification(this.$i18n.t('errors.creating_signoff'))
      }
    },
    async deleteSignoff(signoff, som) {
      try {
        const { error } = await supabase
          .from('signoffs')
          .delete()
          .eq('id', signoff.id)
        if (error) throw error
        successNotification(this.$i18n.t('notifications.signoff_deleted'))
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return true
      } catch(error) {
        errorNotification(this.$i18n.t('errors.deleting_signoff'))
      }
    }
  }
})
