import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { getPagination } from '@/utils/pagination'
import { errorNotification, successNotification } from '@/utils/notifications'
// import useEventsBus from '@/eventBus'

// const { emit } = useEventsBus()

export const useThreads = defineStore('threads-store', {
  state: () => {
    return {
      threads: {},
    }
  },

  getters: {
    proposalThreads: (state) => {
      return (proposalId) => {
        if (state.threads[proposalId]) {
          return state.threads[proposalId].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        }
        return []
      }
    }
  },

  actions: {
    async createThread(thread) {
      try {
        const { data, error } = await supabase
          .from('threads')
          .insert([thread])
          .select()
        if (error) throw error
        successNotification(this.$i18n.t('notifications.thread_msg_created'))
        return data
      } catch(error) {
        errorNotification(this.$i18n.t('errors.creating_thread_msg'))
      }
    },
    async getThreads(proposalId, page, size) {
      const { from, to } = getPagination(page, size)
      try {
        const { data, error } = await supabase
          .from('threads')
          .select()
          .eq('proposal_id', proposalId)
          .order('created_at', { ascending: false })
          .range(from, to)
        if (error) throw error
        if (this.threads[proposalId]) {
          this.threads[proposalId] = this.threads[proposalId].concat(data.filter(
            (t) => this.threads[proposalId].map((el) => el.id).indexOf(t.id) < 0)
          )
        } else {
          this.threads[proposalId] = data
        }
        return data.length
      } catch(error) {
        errorNotification(this.$i18n.t('errors.creating_thread_msg'))
      }
    }
  }
})
