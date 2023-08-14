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

const generateMilestoneDuration = (milestones) => {
  // Assuming milestones ordered by milestone
  let progress = 0
  return milestones.map((ml) => {
    let duration = Math.max(ml.month - progress, 1)
    progress = progress + duration
    return {
      ...ml,
      duration,
      progress,
      monthly_payment: roundAmounts(ml.cost / duration)
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

const getNextPayment = (milestones, current) => {
  const somsApproved = milestones.map((m) => m.som_signoff_count).every((s) => s > 0)
  if (current && milestones.length > 0 && somsApproved) {
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

const canSubmitSomByChangeRequest = (proposal, som) => {
  if (proposal.change_request?.length > 0) {
    if (som.signoffs?.length > 0) {
      const last_cr = proposal.change_request[proposal.change_request.length - 1]
      const last_signoff = som.signoffs[som.signoffs.length - 1]
      return (last_cr.created_at > last_signoff.created_at)
    }
  }
  return false
}

export {
  getPrevMilestone,
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment,
  canSubmitSomByChangeRequest
}
