import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'
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
        if (error) throw error
        successNotification('PoA created.')
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        console.log(error)
        errorNotification('Error creating PoA.')
      }
    },
  }
})
