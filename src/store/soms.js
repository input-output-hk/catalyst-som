import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'
import useEventsBus from '@/eventBus'

const { emit } = useEventsBus()

export const useSoms = defineStore('soms-store', {
  state: () => {
    return {
      proposals: {},
      proposal_previews: {},
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
    async getSoms(proposal_id, milestone, limit) {
      try {
        const { data, error } = await supabase
          .from('soms')
          .select('*, signoffs(id), som_reviews(*, users(role)), poas(*, poas_reviews(*, users(role)))')
          .eq('proposal_id', proposal_id)
          .eq('milestone', milestone)
          .order('created_at', { ascending: false })
          .order('created_at', { foreignTable: 'poas', ascending: false })
          .order('created_at', { foreignTable: 'som_reviews', ascending: false })
          .limit(limit)

        if (!this.proposals[proposal_id]) {
          this.proposals[proposal_id] = {}
        }
        this.proposals[proposal_id][milestone] = data
      } catch(error) {
        errorNotification('Error fetching soms.')
      }
    },
    async getSomsPreview(proposal_id, milestone) {
      try {
        const { data, error } = await supabase
          .from('soms')
          .select('month, cost, completion, som_reviews(outputs_approves, success_criteria_approves, evidence_approves), poas(poas_reviews(content_approved))')
          .eq('proposal_id', proposal_id)
          .eq('milestone', milestone)
          .order('created_at', { ascending: false })
          .order('created_at', { foreignTable: 'poas', ascending: false })
          .order('created_at', { foreignTable: 'som_reviews', ascending: false })
          .limit(1, {foreignTable: 'poas'})
          .limit(1)

        if (!this.proposal_previews[proposal_id]) {
          this.proposal_previews[proposal_id] = {}
        }
        this.proposal_previews[proposal_id][milestone] = data
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
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        console.log(error)
        errorNotification('Error creating SoM.')
      }
    },
  }
})
