import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { getPagination } from '@/utils/pagination'
import { errorNotification, successNotification } from '@/utils/notifications'

export const useUsers = defineStore('users-store', {
  state: () => {
    return {
      _users: {},
      _selectUsers: [],
      _count: 0
    }
  },

  getters: {
    users(state) {
      return state._users
    },
    count(state) {
      return state._count
    },
    selectUsers(state) {
      return state._selectUsers
    }
  },

  actions: {
    async getCount() {
      try {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          this._count = count
        if (error) throw(error)
        return count
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_users_count'))
      }
    },
    async getUsers(page, size) {
      const { from, to } = getPagination(page, size)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*, challenges_users(*, challenges(id, title)), proposals_users(*, proposals(id, title)), allocations(*, proposals(id, title))')
          .order('created_at, id', { ascending: true })
          .range(from, to)
        if (error) throw(error)
        this._users = data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_users'))
      }
    },
    async updateUserChallenges(challengesUsers, user) {
      try {
        const { error } = await supabase
          .from('challenges_users')
          .delete()
          .eq('user_idd', user.id)
        if (error) throw(error)
        try {
          const { error } = await supabase
            .from('challenges_users')
            .insert(challengesUsers)
          if (error) throw(error)
          successNotification(this.$i18n.t('notifications.users_updated'))
        } catch(error) {
          errorNotification(this.$i18n.t('errors.updating_users'))
        }
      } catch(error) {
        errorNotification(this.$i18n.t('errors.updating_users'))
      }
    },
    async updateUserProposals(proposalsUsers, user) {
      try {
        const { error } = await supabase
          .from('proposals_users')
          .delete()
          .eq('user_idd', user.id)
        if (error) throw(error)
        try {
          const { error } = await supabase
            .from('proposals_users')
            .insert(proposalsUsers)
          if (error) throw(error)
        } catch(error) {
          errorNotification(this.$i18n.t('errors.updating_users'))
        }
      } catch(error) {
        errorNotification(this.$i18n.t('errors.updating_users'))
      }
    },
    async updateUserAllocatedProposals(proposalsUsers, user) {
      try {
        const { error } = await supabase
          .from('allocations')
          .delete()
          .eq('user_idd', user.id)
        if (error) throw(error)
        try {
          const { error } = await supabase
            .from('allocations')
            .insert(proposalsUsers)
          if (error) throw(error)
        } catch(error) {
          errorNotification(this.$i18n.t('errors.updating_allocations'))
        }
      } catch(error) {
        errorNotification(this.$i18n.t('errors.updating_allocations'))
      }
    },
    async updateRole(role, user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({'role': role})
          .eq('id', user.id)
        if (error) throw(error)
      } catch(error) {
        errorNotification(this.$i18n.t('errors.updating_role'))
      }
    },
    async getSelectUsersByEmail(email) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, user_id, email')
          .like('email', `%${email}%`)
        this._selectUsers = data
        if (error) throw(error)
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_users'))
      }
    },
    async getSubmittedPoaReviews(fund, from, to) {
      try {
        const { data, error } = await supabase
          .rpc('getsubmittedpoareviews', {
            _fund: fund,
            _from: from,
            _to: to
          })
        if (error) throw(error)
        const reviewers = await supabase
          .from('users')
          .select('*')
          .eq('role', 1)
        if (reviewers.error) throw(reviewers.error)
        return {
          reviews: data,
          reviewers: reviewers.data
        }
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    },
    async getSubmittedSomReviews(fund, from, to) {
      try {
        const { data, error } = await supabase
          .rpc('getsubmittedsomreviews', {
            _fund: fund,
            _from: from,
            _to: to
          })
        if (error) throw(error)
        const reviewers = await supabase
          .from('users')
          .select('*')
          .lte('role', 2)
        const proposals_signed_off = await supabase.rpc('get_proposals_som_signed_off')
        if (reviewers.error) throw(reviewers.error)
        return {
          reviews: data,
          reviewers: reviewers.data,
          proposals_signed_off: proposals_signed_off.data
        }
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    }
  }
})
