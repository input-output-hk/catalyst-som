import { groupBy } from '@/utils/groupBy.js'
import {
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment
} from '@/utils/milestones'

export const preparePaymentsData = (allSoms) => {
  const somsByProposal = groupBy(allSoms, 'project_id')
  const maxMilestones = 10
  const result = Object.keys(somsByProposal).map((proposal_id) => {
    const soms = somsByProposal[proposal_id]
    const durations = generateMilestoneDuration(soms)
    const currentMilestone = getCurrentMilestone(durations)
    const nextPayment = getNextPayment(durations, currentMilestone)
    if (nextPayment) {
      const proposal = {
        proposal_id: soms[0].project_id,
        title: soms[0].title,
        budget: soms[0].budget,
        funds_distributed: soms[0].funds_distributed,
        poa_payment: nextPayment.poaPayment,
        chunk_payment: nextPayment.chunkPayment,
        tot_payment: (nextPayment.poaPayment + nextPayment.chunkPayment)
      }
      soms.forEach((som) => {
        proposal[`m${som.milestone}_month`] = som.month
        proposal[`m${som.milestone}_cost`] = som.cost
        proposal[`m${som.milestone}_completion`] = som.completion
        proposal[`m${som.milestone}_som_signoff`] = som.som_signoff_count > 0
        proposal[`m${som.milestone}_poa_submitted`] = (som.poas_id !== null)
        proposal[`m${som.milestone}_poa_signoff`] = som.poa_signoff_count > 0
      })
      Array.from(Array(maxMilestones)).forEach((_, i) => {
        const x = i + 1
        if (!(`m${x}_month` in proposal)) {
          proposal[`m${x}_month`] = ''
        }
        if (!(`m${x}_cost` in proposal)) {
          proposal[`m${x}_cost`] = ''
        }
        if (!(`m${x}_completion` in proposal)) {
          proposal[`m${x}_completion`] = ''
        }
        if (!(`m${x}_som_signoff` in proposal)) {
          proposal[`m${x}_som_signoff`] = ''
        }
        if (!(`m${x}_poa_submitted` in proposal)) {
          proposal[`m${x}_poa_submitted`] = ''
        }
        if (!(`m${x}_poa_signoff` in proposal)) {
          proposal[`m${x}_poa_signoff`] = ''
        }
      })
      return proposal
    }
    return null
  }).filter(p => p !== null)
  return result
}

export const prepareReviewsPaymentsData = (reviews, fund, pricePerReview) => {
  const _reviews = reviews.reviews
  const users = reviews.reviewers
  const reviewsByReviewer = groupBy(_reviews, 'email')
  const results = []
  Object.keys(reviewsByReviewer).forEach((email) => {
    const reviewerGroup = reviewsByReviewer[email]
    if (reviewerGroup.length > 0) {
      const reviewerEmail = reviewerGroup[0].email
      const user = users.find(u => u.email === reviewerEmail)
      if (user) {
        const totalRewards = reviewerGroup.length * pricePerReview
        const alreadyPayed = Object.keys(user.payment_received).includes(fund) ? user.payment_received[fund] : 0
        const pendingRewards = totalRewards - alreadyPayed
        results.push({
          email: user.email,
          totalRewards: totalRewards,
          alreadyPayed: alreadyPayed,
          pendingRewards: pendingRewards
        })
      }
    }
    return null
  })
  return results.filter(r => (r))
}
