import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'

export const useUser = defineStore('user-store', {
  state: () => {
    return {
      localUser: {},
      logged: false,
      fetching: false,
      userInfo: {}
    }
  },

  persist: true,

  getters: {
    user(state) {
      return state.localUser;
    },

    getUserInfo(state) {
      return state.userInfo
    },

    isFetching(state) {
      return state.fetching;
    },

    isLogged(state) {
      return state.logged;
    },
    canWriteSom(state) {
      return (proposal_id) => {
        try {
          return state.userInfo.proposals_users.map((el) => el.proposal_id)
            .includes(proposal_id)
        } catch {
          return false
        }
      }
    },
    canWriteSomReview(state) {
      return (proposal_id, challenge_id) => {
        try {
          const ret =
            !state.userInfo.proposals_users.map((el) => el.proposal_id)
              .includes(proposal_id) &&
            (state.userInfo.challenges_users.map((el) => el.challenge_id)
              .includes(challenge_id) || (state.userInfo.role === 2))
          return ret
        } catch {
          return false
        }
      }
    }
  },

  actions: {
    async login(email, password) {
      this.fetching = true;
      try {
        const { user, error } = await supabase.auth.signIn({
          email: email,
          password: password
        })
        this.localUser = user
        this.logged = true
        this.getInfo()
        successNotification('Logged in.')
      } catch(error) {
        this.localUser = {}
        this.logged = false
        errorNotification('Error logging in.')
      } finally {
        this.fetching = false;
      }
    },
    async logout() {
      try {
        const { error } = await supabase.auth.signOut()
        this.localUser = {}
        this.userInfo = {}
        this.logged = false
        successNotification('Logged out.')
      } catch(error) {
        console.log(error)
        errorNotification('Error logging out.')
      }
    },
    async resetPassword(email) {
      try {
        const { data, error } = await supabase.auth.api.resetPasswordForEmail(
          email,
          { redirectTo: `${import.meta.env.VITE_LOCAL_BASEURL}/reset-password/` }
        )
        successNotification('Check your email to reset the password.')
      } catch(error) {
        errorNotification('Error resetting Password.')
      }
    },
    async updatePassword(password) {
      this.fetching = true
      try {
        const { data, error } = await supabase.auth.update({
          password: password,
        })
        successNotification('Password updated successfully!')
      } catch(error) {
        errorNotification('There was an error updating your password.')
      } finally {
        this.fetching = true
      }
    },
    async getInfo() {
      if (this.logged) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*, challenges_users(*, challenges(id, title)), proposals_users(*, proposals(id, title, url, project_id))')
            .eq('user_id', this.localUser.id)
          console.log(this.userInfo)
          this.userInfo = data[0]
        } catch(error) {
          console.log(error)
          errorNotification('Error fetching user info.')
        }
      }
    }
  }
})
