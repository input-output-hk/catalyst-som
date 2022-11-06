import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'

export const useProposals = defineStore('proposals-store', {
  state: () => {
    return {
      _proposals: [],
    }
  },

  getters: {
    proposals(state) {
      return state._proposals;
    }
  },

  actions: {
    async getProposals() {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*, challenges(title)')
        this._proposals = data
      } catch(error) {
        errorNotification('Error fetching proposals.')
      }
    },
    async getProposalsByTitle(title) {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('id, title')
          .like('title', `%${title}%`)
        this._proposals = data
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
