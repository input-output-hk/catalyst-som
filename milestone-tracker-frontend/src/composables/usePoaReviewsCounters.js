import { computed } from 'vue'

export function usePoaReviewsCounters(poa, boolKey) {
  const boolKeys = (boolKey) ? [boolKey.value] : ['content']

  const poaReviewsApproved = computed(() => {
    try {
      return poa.value.poas_reviews.filter(r => r.current).filter((r) => {
        return boolKeys.map((el) => r[`${el}_approved`]).every(el => el)
      }).length
    } catch {
      return 0
    }
  })
  const poaReviewsNotApproved = computed(() => {
    try {
      return poaReviewsTot.value - poaReviewsApproved.value
    } catch {
      return 0
    }
  })

  const poaReviewsTot = computed(() => {
    try {
      return poa.value.poas_reviews.filter(r => r.current).length
    } catch {
      return 0
    }
  })

  return {
    poaReviewsApproved,
    poaReviewsNotApproved,
    poaReviewsTot
  }
}
