import { getShortNameFromId } from "./fund"
import { env } from '@/env'

const roundAmounts = (amount) => {
  return Math.round(amount * 1e2) / 1e2
}

const getPrevMilestone = (milestones, current) => {
  const otherMilestones = milestones.filter(ml => (ml)).filter(
    (ml) => ml.milestone < current
  ).sort((a, b) => b.milestone - a.milestone)
  if (otherMilestones.length) {
    return otherMilestones[0]
  } else {
    return null
  }
}

const fundMonthlyCost = {
  'f9': (cost, duration) => {
    return roundAmounts(cost / duration)
  },
  'f10': (cost, duration) => {
    return roundAmounts(cost / duration)
  },
  'f11': (cost, duration, isLast) => {
    const part = (isLast) ? 1 : 0.8
    return roundAmounts((cost * part) / duration)
  },
  'f12': (cost, duration, isLast) => {
    const part = (isLast) ? 1 : 0.8
    return roundAmounts((cost * part) / duration)
  },
}

const fundPreviousPoaPayments = {
  'f9': () => 0,
  'f10': () => 0,
  'f11': (previousMl) => {
    if (previousMl) {
      return roundAmounts(previousMl.cost * 0.2)
    }
    return 0
  },
  'f12': (previousMl) => {
    if (previousMl) {
      return roundAmounts(previousMl.cost * 0.2)
    }
    return 0
  }
}

const generateMilestoneDuration = (milestones, fund) => {
  // Assuming milestones ordered by milestone
  let progress = 0
  const last = (milestones && milestones.length > 0) ? milestones[0].milestones_qty : 100
  return milestones.map((ml, idx) => {
    const isLast = ml.milestone === last
    let duration = Math.max(ml.month - progress, 1)
    progress = progress + duration
    return {
      ...ml,
      duration,
      progress,
      monthly_payment: fundMonthlyCost[fund](ml.cost, duration, isLast),
      previous_poa_payment: fundPreviousPoaPayments[fund](milestones[idx - 1])
    }
  })
}

const getCurrentMilestone = (milestones) => {
  if (milestones.length === 0) {
    return undefined
  }
  const lastMilestone = Math.max(...milestones.map(m => m.milestone))
  const accumulator = milestones.reduce((acc, ml) => {
    if (acc.continuing) {
      if (ml.poa_signoff_count > 0) {
        acc.milestone = Math.min(ml.milestone + 1, lastMilestone)
        acc.availablePoAPayments = acc.availablePoAPayments + ml.cost
      } else {
        acc.continuing = false
      }
    }
    return acc
  }, {
    milestone: 1,
    continuing: true,
    availablePoAPayments: 0
  })
  accumulator.milestone = milestones.find(
    m => m.milestone === accumulator.milestone
  )
  return accumulator
}

const f9f10paymentSchema = (milestones, current) => {
  const somsApproved = milestones.map((m) => m.som_signoff_count).every((s) => s > 0)
  if (current && milestones.length > 0 && somsApproved) {
    if (milestones[0].status === 0) {
      if (current.milestone) {
        const lastMilestone = Math.max(...milestones.map(m => m.milestone))
        let chunkPayment = 0
        const poaPayment = roundAmounts(
          Math.max(current.availablePoAPayments - milestones[0].funds_distributed, 0)
        )
        const excludeCurrent = (
          (current.milestone.milestone === lastMilestone) &&
          (current.milestone.poa_signoff_count > 0)
        )
        const currentDistributedFunds = (
          milestones[0].funds_distributed +
          poaPayment -
          ((excludeCurrent) ? 0 : current.availablePoAPayments)
        )
        let currentChunksPayed = 0
        if (currentDistributedFunds > 0) {
          currentChunksPayed = Math.round(currentDistributedFunds / current.milestone.monthly_payment * 1)/1
        }
        const currentLeftToPay = roundAmounts(current.milestone.cost - currentDistributedFunds)
        if (currentChunksPayed < current.milestone.duration) {
          chunkPayment = Math.min(current.milestone.monthly_payment, currentLeftToPay)
          if (current.milestone.milestone === lastMilestone) {
            if ((current.milestone.duration - currentChunksPayed) === 1) {
              chunkPayment = 0
            }
          }
        }
        return {
          poaPayment,
          chunkPayment,
          currentLeftToPay
        }
      }
    }
  }
  return null
}

const fundsPaymentSchema = {
  'f9': f9f10paymentSchema,
  'f10': f9f10paymentSchema,
  'f11': f9f10paymentSchema,
  'f12': f9f10paymentSchema,
}

const getNextPayment = (milestones, current, fund) => {
  if (Object.keys(fundsPaymentSchema).includes(fund)) {
    return fundsPaymentSchema[fund](milestones, current)
  }
  return null
}

const canSubmitSomByChangeRequest = (proposal, som) => {
  if (proposal.change_request?.length > 0) {
    if (som.signoffs?.length > 0) {
      // In case a SoM exists but a PoA for it was already signed off it should not be possible to
      // resubmit a SoM.
      if (som.poas?.length > 0) {
        const currentPoa = som.poas.find(p => p.current)
        if (currentPoa) {
          if (currentPoa.signoffs?.length > 0) {
            return false
          }
        }
      }
      const last_cr = proposal.change_request[proposal.change_request.length - 1]
      const last_signoff = som.signoffs[som.signoffs.length - 1]
      return (last_cr.created_at > last_signoff.created_at) && last_cr.resubmission
    }
  }
  return false
}

const fundMinimumReviewers = {
  'f9': 1,
  'f10': 2,
  'f11': 2,
  'f12': 2
}

const getMinimumReviewersByFundId = (fundId) => {
  let nrOfReviewers = 2
  const currentFund = getShortNameFromId(fundId)
  if (Object.prototype.hasOwnProperty.call(fundMinimumReviewers, currentFund)) {
    nrOfReviewers = fundMinimumReviewers[currentFund]
  }
  return nrOfReviewers
}

const canSingleSomsBeSignedOffByReviews = (som, fundId) => {
  if (!som) {
    return false
  }
  const reviews = som.som_reviews.filter(r => r.current)
  .map(
    (r) => (
      r.outputs_approves && r.evidence_approves && r.success_criteria_approves
    )
  )
  const minimumReviewersRequired = getMinimumReviewersByFundId(fundId)
  return (
    (
      reviews.every((r) => (r)) && 
      reviews.length >= minimumReviewersRequired
    ) ||
    som.signoffs.length > 0
  )
}

const canAllSomsBeSignedOffByReviews = (soms, fundId) => {
  /* Based on the status of the review received it returns true if all the soms can be signed off.
  This is a requirement to activate the SoM signoff button.
  A single SoM can be signed off if all the reviews received are approvals.
  A minimum of 2 reviews are necessary.
  */
  return soms.every((s) => canSingleSomsBeSignedOffByReviews(s, fundId))
}

const isPreviousSomSignedOff = (soms, currentSom) => {
  if (currentSom) {
    if (currentSom.milestone === 1) {
      return true
    }
    const previousMl = soms.find((s) => {
      if (s) {
        return s.milestone === currentSom.milestone - 1
      }
      return false
    })
    if (previousMl) {
      return previousMl.signoffs.length > 0
    }
  }
  return false
}

const isPreviousPoaSignedOff = (soms, currentSom) => {
  if (currentSom) {
    if (currentSom.milestone === 1) {
      return true
    }
    const previousMl = soms.find((s) => {
      if (s) {
        return s.milestone === currentSom.milestone - 1
      }
      return false
    })
    if (previousMl) {
      if (previousMl.poas.length > 0) {
        const previousPoa = previousMl.poas.find((p) => p.current)
        if (previousPoa) {
          return previousPoa.signoffs.length > 0
        }
      }
    }
  }
  return false
}


// Specific validation rules
const minCostF9 = () => 1

const maxCostF9 = (proposal, otherSomsBudget, isLastMilestone) => {
  return () => {
    const availableBudget = proposal.budget - otherSomsBudget
    const maxMilestoneBudget = parseFloat(env.VITE_MAX_MILESTONE_BUDGET)
    const budgetRule = Math.min(
      Math.ceil(proposal.budget * maxMilestoneBudget), availableBudget
    )
    if (!isLastMilestone && proposal.budget > 0) {
      return budgetRule
    } else {
      return availableBudget
    }
  }
}

const minMonthF9 = (soms, milestone) => {
  return () => {
    const min = getPrevMilestone(soms, milestone)
    return (min) ? parseInt(min.month) + 1 : 1
  }
}

const maxMonthF9 = () => 24

const minCostF10 = (proposal, milestone, isLastMilestone) => {
  return () => {
    let _min = Math.floor(proposal.budget * 0.05)
    if (milestone === 1) {
      _min = Math.min(_min, 75000)
    }
    if (isLastMilestone) {
      _min = Math.floor(proposal.budget * 0.15)
    }
    return _min
  }
}

const maxCostF10 = (proposal, otherSomsBudget, isLastMilestone, milestone) => {
  return () => {
    const availableBudget = proposal.budget - otherSomsBudget
    const maxMilestoneBudget = 0.30
    const budgetRule = Math.min(
      Math.ceil(proposal.budget * maxMilestoneBudget), availableBudget
    )
    const _max = (!isLastMilestone && proposal.budget > 0) ? budgetRule : availableBudget
    if (milestone === 1) {
      return Math.min(_max, 75000)
    }
    return _max
  }
}

const minMonthF10 = (soms, milestone) => {
  return () => {
    const min = getPrevMilestone(soms, milestone)
    return (min) ? parseInt(min.month) + 1 : 1
  }
}

const maxMonthF11 = (soms, milestone, isLastMilestone) => {
  return () => {
    const last = getPrevMilestone(soms, milestone)
    const lastMonth = (last) ? parseInt(last.month) : 0
    const dynamicValue = (isLastMilestone) ? lastMonth + 1 : lastMonth + 3
    return Math.min(11, dynamicValue)
  }
}

const generateValidationRules = (proposal, milestone, otherSomsBudget, isLastMilestone, soms) => {
  const rulesValidationF11 = {
    minCost: minCostF10(proposal, milestone, isLastMilestone),
    maxCost: maxCostF10(
      proposal,
      otherSomsBudget,
      isLastMilestone,
      milestone,
    ),
    minMonth: minMonthF10(soms, milestone),
    maxMonth: maxMonthF11(soms, milestone, isLastMilestone)
  }

  return {
    f9: {
      minCost: minCostF9,
      maxCost: maxCostF9(
        proposal,
        otherSomsBudget,
        isLastMilestone
      ),
      minMonth: minMonthF9(
        soms,
        milestone
      ),
      maxMonth: maxMonthF9,
    },
    f10: {
      minCost: minCostF10(proposal, milestone, isLastMilestone),
      maxCost: maxCostF10(
        proposal,
        otherSomsBudget,
        isLastMilestone,
        milestone,
      ),
      minMonth: minMonthF10(soms, milestone),
      maxMonth: maxMonthF9
    },
    f11: rulesValidationF11,
    f12: rulesValidationF11 // Same as F11
  }
}

export {
  getPrevMilestone,
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment,
  canSubmitSomByChangeRequest,
  canAllSomsBeSignedOffByReviews,
  isPreviousSomSignedOff,
  isPreviousPoaSignedOff,
  generateValidationRules
}
