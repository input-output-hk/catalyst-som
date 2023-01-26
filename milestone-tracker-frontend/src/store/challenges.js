import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification } from '@/utils/notifications'

export const useChallenges = defineStore('challenges-store', {
  state: () => {
    return {
      _challenges: [],
    }
  },

  getters: {
    challenges(state) {
      return state._challenges;
    }
  },

  actions: {
    async getChallenges() {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
        if (error) throw(error)
        this._challenges = data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.fetching_proposals'))
      }
    }
  }
})
