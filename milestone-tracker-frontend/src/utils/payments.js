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

export const prepareReviewsPaymentsData = (reviews, fund, pricePerReview, reward_type) => {
  const users = reviews.reviewers
  const proposals_signed_off = reviews.proposals_signed_off.map((el) => el.project_id)
  const _reviews = reviews.reviews.filter((el) => proposals_signed_off.includes(el.project_id)).map((el, idx) => {
    return {
      ...el,
      _tmp_id: idx
    }
  })
  const reviewsByProject = groupBy(_reviews, 'project_id')
  let to_be_excluded = []
  if (reward_type === 'som') {
    Object.keys(reviewsByProject).forEach((project_id) => {
      const projectGroup = reviewsByProject[project_id]
      const toCheck = projectGroup.filter((el) => el.milestones_qty > el.signoffs_count)
      if (toCheck.length > 0) {
        if (toCheck.length > 1) {
          toCheck.sort((a, b) => new Date(b.latest_som_reviewed_at) - new Date(a.latest_som_reviewed_at)).shift()
        }
        to_be_excluded = to_be_excluded.concat(toCheck)
      }
    })
    to_be_excluded = to_be_excluded.map((el) => el._tmp_id)
  }
  const final_reviews = _reviews.filter((el) => !to_be_excluded.includes(el._tmp_id))
  const results = []
  const reviewsByReviewer = groupBy(final_reviews, 'email')
  Object.keys(reviewsByReviewer).forEach((email) => {
    const reviewerGroup = reviewsByReviewer[email]
    if (reviewerGroup.length > 0) {
      const reviewerEmail = reviewerGroup[0].email
      const user = users.find(u => u.email === reviewerEmail)
      if (user) {
        const totalRewards = reviewerGroup.length * pricePerReview
        const fundExists = Object.keys(user.payment_received).includes(`${fund}`)
        let alreadyPayed = 0
        if (fundExists) {
          alreadyPayed = Object.keys(user.payment_received[`${fund}`]).includes(`${reward_type}`) ? user.payment_received[`${fund}`][`${reward_type}`] : 0
        }
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
