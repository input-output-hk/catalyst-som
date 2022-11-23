import { computed } from 'vue'

export function useSomReviewsCounters(som, boolKey) {
  const boolKeys = (boolKey) ? [boolKey.value] : ['outputs', 'success_criteria', 'evidence']

  const somReviewsApproved = computed(() => {
    try {
      return som.value.som_reviews.filter((r) => {
        return boolKeys.map((el) => r[`${el}_approves`]).every(el => el)
      }).length
    } catch {
      return 0
    }
  })
  const somReviewsNotApproved = computed(() => {
    try {
      return somReviewsTot.value - somReviewsApproved.value
    } catch {
      return 0
    }
  })

  const somReviewsTot = computed(() => {
    try {
      return som.value.som_reviews.length
    } catch {
      return 0
    }
  })

  return {
    somReviewsApproved,
    somReviewsNotApproved,
    somReviewsTot
  }
}
