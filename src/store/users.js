import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { getPagination } from '../utils/pagination'
import { errorNotification, successNotification } from '../utils/notifications'

export const useUsers = defineStore('users-store', {
  state: () => {
    return {
      _users: {},
      _count: 0
    }
  },

  getters: {
    users(state) {
      return state._users
    },
    count(state) {
      return state._count
    }
  },

  actions: {
    async getCount() {
      try {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          this._count = count
          return count
        if (error) {
          throw(error)
        }
      } catch(error) {
        errorNotification('Error fetching users count.')
      }
    },
    async getUsers(page, size) {
      const { from, to } = getPagination(page, size)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*, challenges_users(*, challenges(id, title)), proposals_users(*, proposals(id, title))')
          .order('created_at', { ascending: true })
          .range(from, to)
        if (error) {
          throw(error)
        }
        this._users = data
      } catch(error) {
        errorNotification('Error fetching users.')
      }
    },
    async updateUserChallenges(challengesUsers, user) {
      const { error } = await supabase
        .from('challenges_users')
        .delete()
        .eq('user_idd', user.id)
      const { data, error2 } = await supabase
        .from('challenges_users')
        .insert(challengesUsers)
    },
    async updateUserProposals(proposalsUsers, user) {
      const { error } = await supabase
        .from('proposals_users')
        .delete()
        .eq('user_idd', user.id)
      const { data, error2 } = await supabase
        .from('proposals_users')
        .insert(proposalsUsers)
    },
    async updateRole(role, user) {
      const { error } = await supabase
        .from('users')
        .update({'role': role})
        .eq('id', user.id)
    }
  }
})
