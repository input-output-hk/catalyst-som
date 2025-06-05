import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/milestones', () => ({
  generateMilestoneDuration: vi.fn(),
  getCurrentMilestone: vi.fn(),
  getNextPayment: vi.fn()
}))

vi.mock('../milestones.js', () => ({
  generateValidationRules: vi.fn()
}))

vi.mock('@/utils/fund', () => ({
  getShortNameFromId: vi.fn()
}))
vi.mock('../fund.js', () => ({
  getFundIdFromName: vi.fn()
}))

import {
  preparePaymentsData,
  prepareReviewsPaymentsData
} from '../payments.js'

import {
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment
} from '@/utils/milestones'

import { generateValidationRules } from '../milestones.js'
import { getShortNameFromId } from '@/utils/fund'
import { getFundIdFromName } from '../fund.js'

beforeEach(() => {
  vi.clearAllMocks()

  getShortNameFromId.mockReturnValue('f9')
  getFundIdFromName.mockReturnValue(1)

  generateValidationRules.mockReturnValue({
    f9: {
      minCost: () => 0,
      maxCost: () => Number.MAX_SAFE_INTEGER,
      minMonth: () => 0,
      maxMonth: () => Number.MAX_SAFE_INTEGER
    }
  })

  generateMilestoneDuration.mockImplementation((soms) => soms)
  getCurrentMilestone.mockImplementation((durations) => ({
    milestone: durations[0],
    availablePoAPayments: 1000
  }))
  getNextPayment.mockImplementation((durations) =>
    durations[0].project_id === 1 ? { poaPayment: 100, chunkPayment: 50 } : null
  )
})

describe('preparePaymentsData', () => {
  const mockSoms = [
    {
      project_id: 1,
      milestone: 1,
      cost: 100,
      month: 2,
      completion: 60,
      title: 'Project 1',
      budget: 300,
      funds_distributed: 0,
      poas_id: null,
      som_signoff_count: 1,
      poa_signoff_count: 1
    },
    {
      project_id: 1,
      milestone: 2,
      cost: 200,
      month: 4,
      completion: 30,
      title: 'Project 1',
      budget: 300,
      funds_distributed: 0,
      poas_id: null,
      som_signoff_count: 1,
      poa_signoff_count: 1
    },
    {
      project_id: 2,
      milestone: 1,
      cost: 300,
      month: 3,
      completion: 50,
      title: 'Project 2',
      budget: 600,
      funds_distributed: 0,
      poas_id: null,
      som_signoff_count: 0,
      poa_signoff_count: 0
    }
  ]

  it('should return aggregated payment information only for proposals with an upcoming payment', () => {
    const result = preparePaymentsData(mockSoms, 1) // fundId is irrelevant – mocked as f9

    expect(result).toHaveLength(1)
    const proposal = result[0]

    expect(proposal.proposal_id).toBe(1)
    expect(proposal.title).toBe('Project 1')
    expect(proposal.poa_payment).toBe(100)
    expect(proposal.chunk_payment).toBe(50)
    expect(proposal.tot_payment).toBe(150)

    expect(proposal.validation_total_budget).toBe(true) // 100 + 200 === budget 300
    expect(proposal.validation_all_signed_off).toBe(true)

    expect(proposal.m1_month).toBe(2)
    expect(proposal.m1_cost).toBe(100)
    expect(proposal.m2_completion).toBe(30)

    expect(proposal.m3_month).toBe('')
    expect(proposal.m10_validation_duration).toBe('') // boundary check – maxMilestones = 10
  })
})

describe('prepareReviewsPaymentsData', () => {
  const rewardTiers = [
    { min: 0, max: 500, amount: 5 }
  ]

  const baseReviewsPayload = {
    reviewers: [
      {
        email: 'alice@example.com',
        payment_received: { Fund9: { som: 3 } }
      },
      {
        email: 'bob@example.com',
        payment_received: {}
      }
    ],
    proposals_signed_off: [{ project_id: 1 }, { project_id: 2 }],
    reviews: [
      {
        project_id: 1,
        email: 'alice@example.com',
        budget: 400,
        milestones_qty: 1,
        signoffs_count: 1,
        milestones_reviewed_qty: 1,
        latest_som_reviewed_at: '2024-01-02'
      },
      {
        project_id: 2,
        email: 'bob@example.com',
        budget: 400,
        milestones_qty: 1,
        signoffs_count: 1,
        milestones_reviewed_qty: 1,
        latest_som_reviewed_at: '2024-01-01'
      }
    ]
  }

  it('should aggregate reviewer rewards correctly for SOM reviews', () => {
    const results = prepareReviewsPaymentsData(
      baseReviewsPayload,
      'Fund9', // fund name (mapped to f9 by mocked fund helpers)
      rewardTiers,
      'som'
    )

    expect(results).toHaveLength(2)

    const alice = results.find((r) => r.email === 'alice@example.com')
    expect(alice).toBeDefined()
    expect(alice.totalRewards).toBe(5)
    expect(alice.alreadyPayed).toBe(3)
    expect(alice.pendingRewards).toBe(2)
    expect(alice.projects).toBe('1')

    const bob = results.find((r) => r.email === 'bob@example.com')
    expect(bob).toBeDefined()
    expect(bob.totalRewards).toBe(5)
    expect(bob.alreadyPayed).toBe(0)
    expect(bob.pendingRewards).toBe(5)
    expect(bob.projects).toBe('2')
  })

  it('should aggregate reviewer rewards correctly for PoA reviews', () => {
    const results = prepareReviewsPaymentsData(
      baseReviewsPayload,
      'Fund9',
      rewardTiers,
      'poa'
    )

    expect(results).toHaveLength(2)
    const alice = results.find((r) => r.email === 'alice@example.com')
    expect(alice.totalRewards).toBe(5)
  })
}) 