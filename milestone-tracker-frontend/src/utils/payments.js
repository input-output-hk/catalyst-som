import { groupBy } from '@/utils/groupBy.js'
import {
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment
} from '@/utils/milestones'
import { getShortNameFromId } from '@/utils/fund'
import { generateValidationRules } from './milestones'

export const preparePaymentsData = (allSoms, fundId) => {
  const somsByProposal = groupBy(allSoms, 'project_id')
  const maxMilestones = 10
  const fund = getShortNameFromId(fundId)
  const result = Object.keys(somsByProposal).map((proposal_id) => {
    const soms = somsByProposal[proposal_id]
    const durations = generateMilestoneDuration(soms, fund)
    const currentMilestone = getCurrentMilestone(durations)
    const nextPayment = getNextPayment(durations, currentMilestone, fund)
    if (nextPayment) {
      const totalSomsBudget = soms.reduce((sum, a) => sum + a.cost, 0) 
      const proposal = {
        proposal_id: soms[0].project_id,
        title: soms[0].title,
        budget: soms[0].budget,
        funds_distributed: soms[0].funds_distributed,
        poa_payment: nextPayment.poaPayment,
        chunk_payment: nextPayment.chunkPayment,
        tot_payment: (nextPayment.poaPayment + nextPayment.chunkPayment),
        validation_total_budget: soms[0].budget === totalSomsBudget,
        validation_all_signed_off: soms.every(s => s.som_signoff_count > 0),
      }
      
      soms.forEach((som, idx) => {
        const otherSomsBudget = totalSomsBudget - som.cost
        const isLastMilestone = idx === (soms.length - 1)
        const validationRules = generateValidationRules(
          {budget: soms[0].budget},
          som.milestone,
          otherSomsBudget,
          isLastMilestone,
          soms
        )
        const validationBudget = (
          som.cost >= validationRules[fund].minCost() &&
          som.cost <= validationRules[fund].maxCost()
        )
        const validationDuration = (
          som.month >= validationRules[fund].minMonth() &&
          som.month <= validationRules[fund].maxMonth()
        )
        proposal[`m${som.milestone}_month`] = som.month
        proposal[`m${som.milestone}_cost`] = som.cost
        proposal[`m${som.milestone}_completion`] = som.completion
        proposal[`m${som.milestone}_som_signoff`] = som.som_signoff_count > 0
        proposal[`m${som.milestone}_poa_submitted`] = (som.poas_id !== null)
        proposal[`m${som.milestone}_poa_signoff`] = som.poa_signoff_count > 0
        proposal[`m${som.milestone}_validation_budget`] = validationBudget
        proposal[`m${som.milestone}_validation_duration`] = validationDuration
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
        if (!(`m${x}_validation_budget` in proposal)) {
          proposal[`m${x}_validation_budget`] = ''
        }
        if (!(`m${x}_validation_duration` in proposal)) {
          proposal[`m${x}_validation_duration`] = ''
        }
      })
      return proposal
    }
    return null
  }).filter(p => p !== null)
  return result
}

export const prepareReviewsPaymentsData = (reviews, fund, rewardsTiers, reward_type) => {
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
  const final_reviews = _reviews
    .filter((el) => !to_be_excluded.includes(el._tmp_id))
    .map((el) => {
      const rewardTier = rewardsTiers.find((r) => el.budget > r.min && el.budget <= r.max)
      return {
        reward: (rewardTier) ? parseInt(rewardTier.amount) : 0,
        ...el
      }
    })
  const results = []
  const reviewsByReviewer = groupBy(final_reviews, 'email')
  Object.keys(reviewsByReviewer).forEach((email) => {
    const reviewerGroup = reviewsByReviewer[email]
    if (reviewerGroup.length > 0) {
      const reviewerEmail = reviewerGroup[0].email
      const user = users.find(u => u.email === reviewerEmail)
      if (user) {
        const totalRewards = reviewerGroup.map(r => r.reward).reduce((_sum, a) => _sum + a, 0)
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
          pendingRewards: pendingRewards,
          projects: reviewerGroup.map((p) => p.project_id).join(',')
        })
      }
    }
    return null
  })
  return results.filter(r => (r))
}
