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
        const { data, error } = await supabase
          .from('signoffs')
          .insert([signoff])
        if (error) throw error
        successNotification('Signoff created.')
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        errorNotification('Error creating Signoff.')
      }
    },
  }
})
