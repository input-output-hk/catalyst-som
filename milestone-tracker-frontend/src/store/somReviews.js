import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { errorNotification, successNotification } from '@/utils/notifications'
import useEventsBus from '@/eventBus'

const { emit } = useEventsBus()

export const useSomReviews = defineStore('soms-reviews-store', {
  state: () => {
    return {
      proposals: {},
    }
  },

  getters: {
  },

  actions: {
    async createSomReview(somReview, som) {
      try {
        const { data, error } = await supabase
          .from('som_reviews')
          .insert([somReview])
          .select()
        if (error) throw error
        successNotification(this.$i18n.t('notifications.som_review_created'))
        emit('getSomsBus', {
          proposal_id: som.proposal_id,
          milestone: som.milestone
        })
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.creating_som_review'))
      }
    },
  }
})
