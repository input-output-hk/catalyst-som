import { groupBy } from '@/utils/groupBy.js'

export const prepareDataForExport = async (soms, ids) => {
  ids = ids.map((el) => {
    const approved = (el.som_reviews.length > 0) ? el.som_reviews.map(
      (sr) => sr.outputs_approves && sr.success_criteria_approves && sr.evidence_approves
    ).every(v => v === true) : false
    const poas_approved = (el.poas.length > 0) ? el.poas.map(
      (poa) => poa.poas_reviews.map((pr) => pr.content_approved)
    ).every(v => v === true) : false
    return {...el, approved, poas_approved}
  })
  let soms2 = soms.map((el) => {
    const related = ids.find((i) => i.id === el.id)
    return {...el, ...related}
  })
  const res = groupBy(soms2, 'project_id')
  return res
}

export const formatDataForExport = async (proposals) => {
  const result = Object.keys(proposals).map((p) => {
    const proposal = proposals[p]
    let output = {
      id: p,
      title: proposal[0].title,
      budget: proposal[0].budget,
      project_id: proposal[0].project_id,
    }
    const mls = [1,2,3,4,5]
    mls.forEach((i) => {
      const m1 = proposal.find((m) => m.milestone === i)
      output[`m${i}_month`] = (m1) ? m1.month : ''
      output[`m${i}_cost`] = (m1) ? m1.cost : ''
      output[`m${i}_completion`] = (m1) ? m1.completion : ''
      output[`m${i}_approved`] = (m1) ? m1.approved : false
      output[`m${i}_poa_approved`] = (m1) ? m1.poas_approved : false
    })
    return output
  })
  return result
}
