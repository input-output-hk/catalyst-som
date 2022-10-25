import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'

export const useSoms = defineStore('soms-store', {
  state: () => {
    return {
      proposals: {},
    }
  },

  getters: {
    soms(state, proposal_id, milestone) {
      try {
        return state.proposals[proposal_id][milestone]
      } catch(error) {
        return []
      }
    }
  },

  actions: {
    async getSoms(proposal_id, milestone) {
      try {
        const { data, error } = await supabase
          .from('soms')
          .select('*, som_reviews(*), poas(*, poas_reviews(*))')
          .eq('proposal_id', proposal_id)
          .eq('milestone', milestone)
          .order('created_at', { ascending: false })
          .order('created_at', { foreignTable: 'poas', ascending: false })
          .order('created_at', { foreignTable: 'som_reviews', ascending: false })

        if (!this.proposals[proposal_id]) {
          this.proposals[proposal_id] = {}
        }
        this.proposals[proposal_id][milestone] = data
      } catch(error) {
        errorNotification('Error fetching soms.')
      }
    },
    async getSom(id) {
      //
    },
    async createSom(som) {
      try {
        const { data, error } = await supabase
          .from('soms')
          .insert([som])
        if (error) throw error
        successNotification('SoM created.')
        //this.getSoms(som.proposal_id, som.milestone)
        return data
      } catch(error) {
        console.log(error)
        errorNotification('Error creating SoM.')
      }
    },
  }
})
