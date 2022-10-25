import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'

export const useProposals = defineStore('proposals-store', {
  state: () => {
    return {
      localProposals: [],
    }
  },

  getters: {
    proposals(state) {
      return state.localProposals;
    }
  },

  actions: {
    async getProposals() {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
        this.localProposals = data
      } catch(error) {
        errorNotification('Error fetching proposals.')
      }
    },
    async getProposal(id) {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*, challenges(*)')
          .eq('project_id', id)
        return (data.length > 0) ? data[0] : {}
      } catch(error) {
        errorNotification('Error fetching proposals.')
      }
    },
  }
})
