import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification, successNotification } from '@/utils/notifications'

import { env } from '@/env'

const REFRESH_USERINFO_INTERVAL = 1000 * 60 * 5

export const useUser = defineStore('user-store', {
  state: () => {
    return {
      localUser: {},
      logged: false,
      fetching: false,
      userInfo: {}
    }
  },

  intervalCheck: false,

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
        if (this.isAdmin) {
          return true
        }
        try {
          return state.userInfo.proposals_users.map((el) => el.proposal_id)
            .includes(proposal_id)
        } catch {
          return false
        }
      }
    },
    canWriteSomReview(state) {
      /*
      A user is allowed to write a SoM review if:
      - It's not the proposal owner
      AND
      (
        - The proposal is in their allocations as reviewer
        OR
        - The proposal is in their allocations as signoff
        OR
        - Has Admin, IO team role or Signoff role
      )
      */
      return (proposal_id) => {
        if (this.isAdmin) {
          return true
        }
        try {
          const ret =
            !state.userInfo.proposals_users.map((el) => el.proposal_id)
              .includes(proposal_id) &&
            (
              state.userInfo.allocations_signoff.map(
                (el) => el.proposal_id
              ).includes(proposal_id) ||
              state.userInfo.allocations.map(
                (el) => el.proposal_id
              ).includes(proposal_id) ||
              [2,4].includes(state.userInfo.role)
            )
          return ret
        } catch {
          return false
        }
      }
    },
    canSignoff(state) {
      return (proposal_id) => {
        if (this.isAdmin) {
          return true
        }
        try {
          const ret =
            !state.userInfo.proposals_users.map((el) => el.proposal_id)
              .includes(proposal_id) &&
            (
              state.userInfo.allocations_signoff.map(
                (el) => el.proposal_id
              ).includes(proposal_id) ||
              [3].includes(state.userInfo.role)
            )
          return ret
        } catch {
          return false
        }
      }
    },
    isAdmin(state) {
      return [3].includes(state.userInfo.role)
    },
    canSetAllocations(state) {
      return [2,3].includes(state.userInfo.role)
    },
    canSetChangeRequests(state) {
      return [2,3].includes(state.userInfo.role)
    }
  },

  actions: {
    async login(email, password) {
      this.fetching = true;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        })
        if (error) throw(error)
        this.localUser = data.user
        this.logged = true
        this.getInfo()
        successNotification(this.$i18n.t('notifications.logged_in'))
        this.$router.push({name: 'proposals'})
        this.pollingUserInfo()
      } catch(error) {
        this.resetState()
        errorNotification(error.message)
      } finally {
        this.fetching = false;
      }
    },
    async logout() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw(error)
        this.resetState()
        successNotification(this.$i18n.t('notifications.logged_out'))
      } catch(error) {
        errorNotification(error.message)
      }
    },
    resetState() {
      this.localUser = {}
      this.userInfo = {}
      this.logged = false
      this.intervalCheck = clearInterval(this.intervalCheck)
      this.$router.push({name: 'login'})
    },
    pollingUserInfo() {
      if (this.intervalCheck) {
        this.intervalCheck = clearInterval(this.intervalCheck)
      }
      this.intervalCheck = setInterval(async () => {
        if (this.logged) {
          await this.getInfo()
        } else {
          this.intervalCheck = clearInterval(this.intervalCheck)
        }
      }, REFRESH_USERINFO_INTERVAL)
    },
    async resetPassword(email) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: `${env.VITE_LOCAL_BASEURL}/reset-password/` }
        )
        if (error) throw(error)
        successNotification(this.$i18n.t('notifications.check_email'))
      } catch(error) {
        errorNotification(error.message)
      }
    },
    async updatePassword(password) {
      this.fetching = true
      try {
        const { error } = await supabase.auth.updateUser({
          password: password,
        })
        if (error) throw(error)
        successNotification(this.$i18n.t('notifications.password_updated'))
        this.$router.push({name: 'login'})
      } catch(error) {
        errorNotification(error.message)
      } finally {
        this.fetching = true
      }
    },
    async getInfo() {
      if (this.logged) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*, challenges_users(*, challenges(id, title)), proposals_users(*, proposals(id, title, url, project_id)), allocations(*, proposals(id, title, url, project_id)), allocations_signoff(*, proposals(id, title, url, project_id))')
            .eq('user_id', this.localUser.id)
          if (error) throw(error)
          this.userInfo = data[0]
        } catch(error) {
          errorNotification(error.message)
        }
      }
    },
    async getSignoffNotifications(from) {
      try {
        const { data, error } = await supabase
          .rpc('getsignedoff', {
            _date: from
          })
        if (error) {
          throw(error)
        }
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_soms'))
      }
    },
    async getSomReviewsNotifications() {
      try {
        const { data, error } = await supabase
          .rpc('getsomsreviews')
        if (error) {
          throw(error)
        }
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_soms'))
      }
    },
    async getPoaReviewsNotifications() {
      try {
        const { data, error } = await supabase
          .rpc('getpoasreviews')
        if (error) {
          throw(error)
        }
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_poas'))
      }
    },
    async getPoasToBeSignedOff(from = false, nr_reviews = [0, 10], nr_approvals = [0, 10]) {
      if (!from) {
        from = new Date(null).toISOString()
      }
      try {
        const { data, error } = await supabase
          .rpc('getpoastobesignedoff', {
            _from: from,
            _max_nr_approvals: nr_approvals[1],
            _max_nr_reviews: nr_reviews[1],
            _min_nr_approvals: nr_approvals[0],
            _min_nr_reviews: nr_reviews[0]
          })
        if (error) throw(error)
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_poas'))
      }
    },
    async getSomsToBeSignedOff(from = false, nr_reviews = [0, 10], nr_approvals = [0, 10]) {
      if (!from) {
        from = new Date(null).toISOString()
      }
      try {
        const { data, error } = await supabase
          .rpc('getsomstobesignedoff', {
            _from: from,
            _min_nr_reviews: nr_reviews[0],
            _max_nr_reviews: nr_reviews[1],
            _min_nr_approvals: nr_approvals[0],
            _max_nr_approvals: nr_approvals[1]
          })
        if (error) throw(error)
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_soms'))
      }
    },
    async initUser() {
      if (this.logged) {
        try {
          const { data, error } = await supabase.auth.getSession()
          if (error) throw(error)
          if (!data.session) {
            this.resetState()
          } else {
            this.getInfo()
            this.pollingUserInfo()
          }
        } catch(error) {
          this.resetState()
        }
      }
    }
  }
})
