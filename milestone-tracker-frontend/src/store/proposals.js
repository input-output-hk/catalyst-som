import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { getPagination } from '@/utils/pagination'
import { errorNotification, successNotification } from '@/utils/notifications'

export const useProposals = defineStore('proposals-store', {
  state: () => {
    return {
      _proposals: [],
      _selectProposals: []
    }
  },

  getters: {
    proposals(state) {
      return state._proposals
    },
    selectProposals(state) {
      return state._selectProposals
    }
  },

  actions: {
    async getCount() {
      try {
        const { count, error } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          this._count = count
          return count
        if (error) {
          throw(error)
        }
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals_count'))
      }
    },
    async getProposals(page, size) {
      const { from, to } = getPagination(page, size)
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*, challenges(title), allocations(*, users(id, user_id, email))')
          .range(from, to)
        if (error) {
          throw(error)
        }
        this._proposals = data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    },
    async getSelectProposalsByTitle(title) {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('id, title')
          .like('title', `%${title}%`)
        this._selectProposals = data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    },
    async getProposal(id) {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*, challenges(*), allocations(*, users(id, user_id, email))')
          .eq('project_id', id)
        return (data.length > 0) ? data[0] : {}
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    },
    async getProposalsForExport() {
      try {
        const { data, error } = await supabase
          .rpc('getmilestones')
        if (error) {
          throw(error)
        }
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    },
    async getProposalSnapshot(project_id) {
      try {
        const { data, error } = await supabase
          .rpc('getproposalsnapshot', {
            _project_id: project_id
          })
        if (error) {
          throw(error)
        }
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    },
    async getSomsById(ids) {
      try {
        const { data, error } = await supabase
          .from('soms')
          .select('id, month, cost, completion, som_reviews(outputs_approves, success_criteria_approves, evidence_approves), poas(poas_reviews(content_approved))')
          .in('id', ids)
          .order('created_at', { ascending: false })
          .order('created_at', { foreignTable: 'poas', ascending: false })
          .order('created_at', { foreignTable: 'som_reviews', ascending: false })
          .limit(1, {foreignTable: 'poas'})
        if (error) {
          throw(error)
        }
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    },
    async updateProposalAllocations(allocations, proposal) {
      try {
        const { error } = await supabase
          .from('allocations')
          .delete()
          .eq('proposal_id', proposal.id)
          try {
            const { error } = await supabase
            .from('allocations')
            .insert(allocations)
            successNotification(this.$i18n.t('notifications.allocation_updated'))
          } catch (error) {
            errorNotification(this.$i18n.t('errors.updating_allocations'))
          }
      } catch (error) {
        errorNotification(this.$i18n.t('errors.updating_allocations'))
      }
    },
  }
})
