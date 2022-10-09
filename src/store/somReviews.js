import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'

export const useSomReviews = defineStore('soms-reviews-store', {
  state: () => {
    return {
      proposals: {},
    }
  },

  getters: {
  },

  actions: {
    async createSomReview(somReview) {
      try {
        const { data, error } = await supabase
          .from('som_reviews')
          .insert([somReview])
        if (error) throw error
        successNotification('SoM review created.')
        return data
      } catch(error) {
        console.log(error)
        errorNotification('Error creating SoM review.')
      }
    },
  }
})
