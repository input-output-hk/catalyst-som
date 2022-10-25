import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'

export const usePoaReviews = defineStore('poas-reviews-store', {
  state: () => {
    return {
      proposals: {},
    }
  },

  getters: {
  },

  actions: {
    async createPoaReview(poaReview) {
      try {
        const { data, error } = await supabase
          .from('poas_reviews')
          .insert([poaReview])
        if (error) throw error
        successNotification('PoA review created.')
        return data
      } catch(error) {
        console.log(error)
        errorNotification('Error creating PoA review.')
      }
    },
  }
})
