import { groupBy } from '@/utils/groupBy.js'
import {
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment
} from '@/utils/milestones'

export const preparePaymentsData = (allSoms) => {
  const somsByProposal = groupBy(allSoms, 'project_id')
  const result = Object.keys(somsByProposal).map((proposal_id) => {
    const soms = somsByProposal[proposal_id]
    const durations = generateMilestoneDuration(soms)
    const currentMilestone = getCurrentMilestone(durations)
    const nextPayment = getNextPayment(durations, currentMilestone)
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
    return proposal
  })
  return result
}
