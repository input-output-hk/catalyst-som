import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification, successNotification } from '@/utils/notifications'
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
          .select(`
            *,
            signoffs(id, created_at),
            signoff_withdraws(
              created_at,
              original_signed_off_at,
              user:signoff_withdraws_user_id_fkey(email),
              signer:signoff_withdraws_signer_id_fkey(email)
            ),
            som_reviews(
              *,
              users(email)
            ),
            poas(
              *,
              poas_reviews(*, users(email)),
              signoffs(id, created_at)
            )
          `)
          .eq('proposal_id', proposal_id)
          .eq('milestone', milestone)
          //.eq('som_reviews.current', true)
          //.eq('poas.poas_reviews.current', true)
          .order('current', { ascending: false })
          .order('created_at', { ascending: false })
          .order('created_at', { foreignTable: 'poas', ascending: false })
          .order('created_at', { foreignTable: 'som_reviews', ascending: false })
          .limit(limit)
        if (error) throw(error)
        if (!this.proposals[proposal_id]) {
          this.proposals[proposal_id] = {}
        }
        this.proposals[proposal_id][milestone] = data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_soms'))
      }
    },
    async getSomsPreview(proposal_id, milestone) {
      try {
        const { data, error } = await supabase
          .from('soms')
          .select('month, cost, completion, som_reviews(outputs_approves, success_criteria_approves, evidence_approves, current), poas(poas_reviews(content_approved, current), signoffs(created_at))')
          .eq('proposal_id', proposal_id)
          .eq('milestone', milestone)
          .order('current', { ascending: false })
          .order('created_at', { ascending: false })
          .eq('som_reviews.current', true)
          .eq('poas.poas_reviews.current', true)
          .order('current', { foreignTable: 'poas', ascending: false })
          .order('created_at', { foreignTable: 'poas', ascending: false })
          .order('created_at', { foreignTable: 'som_reviews', ascending: false })
          .limit(1, {foreignTable: 'poas'})
          .limit(1)
        if (error) throw(error)
        if (!this.proposal_previews[proposal_id]) {
          this.proposal_previews[proposal_id] = {}
        }
        this.proposal_previews[proposal_id][milestone] = data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_soms'))
      }
    },
    async getSomsByAllocation() {
      try {
        const { data, error } = await supabase
          .rpc('getallocatedsoms')
        if (error) {
          throw(error)
        }
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_soms'))
      }
    },
    async getSom() {
      //
    },
    async createSom(som) {
      try {
        const { data, error } = await supabase
          .from('soms')
          .insert([som])
          .select()
        if (error) throw error
        successNotification(this.$i18n.t('notifications.som_created'))
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.creating_som'))
      }
    },
  }
})
