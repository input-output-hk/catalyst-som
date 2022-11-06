import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { getPagination } from '@/utils/pagination'
import { errorNotification, successNotification } from '@/utils/notifications'

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
        errorNotification('Error fetching proposals count.')
      }
    },
    async getProposals(page, size) {
      const { from, to } = getPagination(page, size)
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*, challenges(title)')
          .range(from, to)
        if (error) {
          throw(error)
        }
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
