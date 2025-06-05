import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/groupBy.js', () => ({
  groupBy: vi.fn()
}))

vi.mock('@/utils/milestones', () => ({
  generateMilestoneDuration: vi.fn(),
  getCurrentMilestone: vi.fn(),
  getNextPayment: vi.fn()
}))

vi.mock('../milestones.js', () => ({
  generateMilestoneDuration: vi.fn(),
  getCurrentMilestone: vi.fn(),
  getNextPayment: vi.fn(),
  generateValidationRules: vi.fn()
}))

vi.mock('@/utils/fund', () => ({
  getShortNameFromId: vi.fn()
}))

vi.mock('../fund.js', () => ({
  getFundIdFromName: vi.fn(),
  getShortNameFromId: vi.fn()
}))

import {
  preparePaymentsData,
  prepareReviewsPaymentsData
} from '../payments.js'

import { groupBy } from '@/utils/groupBy.js'
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

  groupBy.mockImplementation((array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  })

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
    const result = preparePaymentsData(mockSoms, 1)

    expect(result).toHaveLength(1)
    const proposal = result[0]

    expect(proposal.proposal_id).toBe(1)
    expect(proposal.title).toBe('Project 1')
    expect(proposal.poa_payment).toBe(100)
    expect(proposal.chunk_payment).toBe(50)
    expect(proposal.tot_payment).toBe(150)

    expect(proposal.validation_total_budget).toBe(true)
    expect(proposal.validation_all_signed_off).toBe(true)

    expect(proposal.m1_month).toBe(2)
    expect(proposal.m1_cost).toBe(100)
    expect(proposal.m2_completion).toBe(30)

    expect(proposal.m3_month).toBe('')
    expect(proposal.m10_validation_duration).toBe('')
  })

  it('should return empty array when no proposals have upcoming payments', () => {
    getNextPayment.mockReturnValue(null)

    const result = preparePaymentsData(mockSoms, 1)
    expect(result).toHaveLength(0)
  })

  it('should calculate validation flags correctly', () => {
    const somsWithMismatchedBudget = [
      {
        project_id: 1,
        milestone: 1,
        cost: 100,
        month: 2,
        completion: 60,
        title: 'Project 1',
        budget: 500,
        funds_distributed: 0,
        poas_id: null,
        som_signoff_count: 0,
        poa_signoff_count: 0
      },
      {
        project_id: 1,
        milestone: 2,
        cost: 200,
        month: 4,
        completion: 30,
        title: 'Project 1',
        budget: 500,
        funds_distributed: 0,
        poas_id: null,
        som_signoff_count: 1,
        poa_signoff_count: 0
      }
    ]

    const result = preparePaymentsData(somsWithMismatchedBudget, 1)
    expect(result).toHaveLength(1)
    
    const proposal = result[0]
    expect(proposal.validation_total_budget).toBe(false)
    expect(proposal.validation_all_signed_off).toBe(false)
  })

  it('should populate milestone fields correctly for all milestones', () => {
    const somsWithPoA = [
      {
        project_id: 1,
        milestone: 1,
        cost: 100,
        month: 2,
        completion: 60,
        title: 'Project 1',
        budget: 300,
        funds_distributed: 0,
        poas_id: 123,
        som_signoff_count: 1,
        poa_signoff_count: 1
      }
    ]

    const result = preparePaymentsData(somsWithPoA, 1)
    const proposal = result[0]

    expect(proposal.m1_som_signoff).toBe(true)
    expect(proposal.m1_poa_submitted).toBe(true)
    expect(proposal.m1_poa_signoff).toBe(true)
    expect(proposal.m1_validation_budget).toBe(true)
    expect(proposal.m1_validation_duration).toBe(true)
  })

  it('should handle validation rules correctly', () => {
    generateValidationRules.mockReturnValue({
      f9: {
        minCost: () => 50,
        maxCost: () => 150,
        minMonth: () => 1,
        maxMonth: () => 5
      }
    })

    const somsWithValidation = [
      {
        project_id: 1,
        milestone: 1,
        cost: 200,
        month: 6,
        completion: 60,
        title: 'Project 1',
        budget: 300,
        funds_distributed: 0,
        poas_id: null,
        som_signoff_count: 1,
        poa_signoff_count: 1
      }
    ]

    const result = preparePaymentsData(somsWithValidation, 1)
    const proposal = result[0]

    expect(proposal.m1_validation_budget).toBe(false)
    expect(proposal.m1_validation_duration).toBe(false)
  })

  it('should populate empty fields for non-existent milestones up to maxMilestones', () => {
    const result = preparePaymentsData(mockSoms, 1)
    const proposal = result[0]

    for (let i = 3; i <= 10; i++) {
      expect(proposal[`m${i}_month`]).toBe('')
      expect(proposal[`m${i}_cost`]).toBe('')
      expect(proposal[`m${i}_completion`]).toBe('')
      expect(proposal[`m${i}_som_signoff`]).toBe('')
      expect(proposal[`m${i}_poa_submitted`]).toBe('')
      expect(proposal[`m${i}_poa_signoff`]).toBe('')
      expect(proposal[`m${i}_validation_budget`]).toBe('')
      expect(proposal[`m${i}_validation_duration`]).toBe('')
    }
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

  it('should handle F13 SOM review payments with milestones_reviewed_qty multiplier', () => {
    getShortNameFromId.mockReturnValue('f13')
    getFundIdFromName.mockReturnValue(5)

    const f13Reviews = {
      ...baseReviewsPayload,
      reviews: [
        {
          project_id: 1,
          email: 'alice@example.com',
          budget: 400,
          milestones_qty: 3,
          signoffs_count: 3,
          milestones_reviewed_qty: 2,
          latest_som_reviewed_at: '2024-01-02'
        }
      ]
    }

    const results = prepareReviewsPaymentsData(
      f13Reviews,
      'Fund13',
      rewardTiers,
      'som'
    )

    expect(results).toHaveLength(1)
    const alice = results.find((r) => r.email === 'alice@example.com')
    expect(alice.totalRewards).toBe(10) // 5 * 2 milestones_reviewed_qty
  })

  it('should exclude incomplete SOM reviews for som reward type', () => {
    const incompleteReviews = {
      reviewers: [
        {
          email: 'alice@example.com',
          payment_received: {}
        }
      ],
      proposals_signed_off: [{ project_id: 1 }],
      reviews: [
        {
          project_id: 1,
          email: 'alice@example.com',
          budget: 400,
          milestones_qty: 3,
          signoffs_count: 2, // Less than milestones_qty
          milestones_reviewed_qty: 2,
          latest_som_reviewed_at: '2024-01-02'
        },
        {
          project_id: 1,
          email: 'alice@example.com',
          budget: 400,
          milestones_qty: 3,
          signoffs_count: 1, // Less than milestones_qty
          milestones_reviewed_qty: 1,
          latest_som_reviewed_at: '2024-01-01'
        }
      ]
    }

    const results = prepareReviewsPaymentsData(
      incompleteReviews,
      'Fund9',
      rewardTiers,
      'som'
    )

    expect(results).toHaveLength(1)
    const alice = results.find((r) => r.email === 'alice@example.com')
    expect(alice.totalRewards).toBe(5) // Only the latest review should be included
  })

  it('should handle reviewers with no matching user data', () => {
    const reviewsWithMissingUser = {
      reviewers: [], // No users
      proposals_signed_off: [{ project_id: 1 }],
      reviews: [
        {
          project_id: 1,
          email: 'missing@example.com',
          budget: 400,
          milestones_qty: 1,
          signoffs_count: 1,
          milestones_reviewed_qty: 1,
          latest_som_reviewed_at: '2024-01-02'
        }
      ]
    }

    const results = prepareReviewsPaymentsData(
      reviewsWithMissingUser,
      'Fund9',
      rewardTiers,
      'som'
    )

    expect(results).toHaveLength(0)
  })

  it('should filter out reviews for non-signed-off proposals', () => {
    const reviewsWithUnsignedProposals = {
      reviewers: [
        {
          email: 'alice@example.com',
          payment_received: {}
        }
      ],
      proposals_signed_off: [{ project_id: 1 }], // Only project 1 is signed off
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
          project_id: 2, // This project is not signed off
          email: 'alice@example.com',
          budget: 400,
          milestones_qty: 1,
          signoffs_count: 1,
          milestones_reviewed_qty: 1,
          latest_som_reviewed_at: '2024-01-01'
        }
      ]
    }

    const results = prepareReviewsPaymentsData(
      reviewsWithUnsignedProposals,
      'Fund9',
      rewardTiers,
      'som'
    )

    expect(results).toHaveLength(1)
    const alice = results.find((r) => r.email === 'alice@example.com')
    expect(alice.projects).toBe('1') // Only project 1 should be included
  })

  it('should handle multiple projects for the same reviewer', () => {
    const multiProjectReviews = {
      reviewers: [
        {
          email: 'alice@example.com',
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
          email: 'alice@example.com',
          budget: 400,
          milestones_qty: 1,
          signoffs_count: 1,
          milestones_reviewed_qty: 1,
          latest_som_reviewed_at: '2024-01-01'
        }
      ]
    }

    const results = prepareReviewsPaymentsData(
      multiProjectReviews,
      'Fund9',
      rewardTiers,
      'som'
    )

    expect(results).toHaveLength(1)
    const alice = results.find((r) => r.email === 'alice@example.com')
    expect(alice.totalRewards).toBe(10) // 5 + 5 for two projects
    expect(alice.projects).toBe('1,2')
  })

  it('should handle reward tiers correctly', () => {
    const tieredRewards = [
      { min: 0, max: 100, amount: 2 },
      { min: 100, max: 500, amount: 5 },
      { min: 500, max: 1000, amount: 10 }
    ]

    const reviewsWithDifferentBudgets = {
      reviewers: [
        { email: 'alice@example.com', payment_received: {} },
        { email: 'bob@example.com', payment_received: {} }
      ],
      proposals_signed_off: [{ project_id: 1 }, { project_id: 2 }],
      reviews: [
        {
          project_id: 1,
          email: 'alice@example.com',
          budget: 50, // Should get 2
          milestones_qty: 1,
          signoffs_count: 1,
          milestones_reviewed_qty: 1,
          latest_som_reviewed_at: '2024-01-02'
        },
        {
          project_id: 2,
          email: 'bob@example.com',
          budget: 750, // Should get 10
          milestones_qty: 1,
          signoffs_count: 1,
          milestones_reviewed_qty: 1,
          latest_som_reviewed_at: '2024-01-01'
        }
      ]
    }

    const results = prepareReviewsPaymentsData(
      reviewsWithDifferentBudgets,
      'Fund9',
      tieredRewards,
      'som'
    )

    expect(results).toHaveLength(2)
    
    const alice = results.find((r) => r.email === 'alice@example.com')
    expect(alice.totalRewards).toBe(2)
    
    const bob = results.find((r) => r.email === 'bob@example.com')
    expect(bob.totalRewards).toBe(10)
  })
}) 