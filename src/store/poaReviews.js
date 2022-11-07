import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { errorNotification, successNotification } from '../utils/notifications'
import useEventsBus from '@/eventBus'

const { emit } = useEventsBus()

export const usePoaReviews = defineStore('poas-reviews-store', {
  state: () => {
    return {
      proposals: {},
    }
  },

  getters: {
  },

  actions: {
    async createPoaReview(poaReview, som) {
      try {
        const { data, error } = await supabase
          .from('poas_reviews')
          .insert([poaReview])
        if (error) throw error
        successNotification('PoA review created.')
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        console.log(error)
        errorNotification('Error creating PoA review.')
      }
    },
  }
})
