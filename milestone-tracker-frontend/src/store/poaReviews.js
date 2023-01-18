import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification, successNotification } from '@/utils/notifications'
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
          .select()
        if (error) throw error
        successNotification(this.$i18n.t('notifications.poa_review_created'))
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        console.log(error)
        errorNotification(this.$i18n.t('errors.creating_poa_review'))
      }
    },
  }
})
