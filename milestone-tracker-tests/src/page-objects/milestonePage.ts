import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

import { stringBase, numberBase } from '../utils/seeds.js'

const milestonePageCommands = {
  startSomSubmission(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@newSomButton${ml}`, 10000)
      .click(`@newSomButton${ml}`)
      .waitForElementVisible('@newSomPopup', 10000)
  },
  fillSom(this: MilestonePage, stringSeed: String, numberSeed: number) {
    return this.waitForElementVisible('@titleInput', 10000)
      .waitForElementVisible('@outputsInput', 10000)
      .waitForElementVisible('@successCriteriaInput', 10000)
      .waitForElementVisible('@evidenceInput', 10000)
      .waitForElementVisible('@costInput', 10000)
      .waitForElementVisible('@monthInput', 10000)
      .waitForElementVisible('@completionInput', 10000)
      .setValue('@titleInput', `Lorem ipsum ${stringSeed}`)
      .click('@outputsInput')
      .sendKeys('@outputsInput', `${stringBase}${stringSeed}`)
      .click('@successCriteriaInput')
      .sendKeys('@successCriteriaInput', `${stringBase}${stringSeed}`)
      .click('@evidenceInput')
      .sendKeys('@evidenceInput', `${stringBase}${stringSeed}`)
      .setValue('@costInput', `${numberBase+numberSeed}`)
      .click('@monthOption')
      .dragAndDrop('@completionInput', {x: 100, y: 0})
  },
  submitSom(this: MilestonePage) {
    return this.waitForElementVisible('@submitSomInput', 10000)
      .click('@submitSomInput')
      .waitForElementNotVisible('@newSomPopup');
  },
  startSomReviewSubmission(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@newSomReviewButton${ml}`, 10000)
      .click(`@newSomReviewButton${ml}`)
      .waitForElementVisible(`@newSomReview${ml}`, 10000)
  },
  fillSomReview(this: MilestonePage, ml: number, stringSeed: String) {
    return this.waitForElementVisible(`@outputs_approved${ml}`, 10000)
      .waitForElementVisible(`@outputs_comment${ml}`, 10000)
      .waitForElementVisible(`@success_criteria_approved${ml}`, 10000)
      .waitForElementVisible(`@success_criteria_comment${ml}`, 10000)
      .waitForElementVisible(`@evidence_approved${ml}`, 10000)
      .waitForElementVisible(`@evidence_comment${ml}`, 10000)
      .click(`@outputs_approved${ml}`)
      .click(`@success_criteria_comment${ml}`)
      .sendKeys(`@success_criteria_comment${ml}`, `${stringBase}${stringSeed}`)
      .click(`@evidence_approved${ml}`)
      .click(`@evidence_comment${ml}`)
      .sendKeys(`@evidence_comment${ml}`, `${stringBase}${stringSeed}`)
  },
  submitSomReview(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@submitSomReview${ml}`, 10000)
      .click(`@submitSomReview${ml}`)
      .waitForElementNotPresent(`@newSomReview${ml}`);
  },
  openSomReviews(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@showSomReviews${ml}`, 10000)
      .click(`@showSomReviews${ml}`)
      .waitForElementPresent(`@somReviewsPopup${ml}`);
  },
  closeSomReviews(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@somReviewsPopupClose${ml}`, 10000)
      .click(`@somReviewsPopupClose${ml}`)
      .waitForElementNotPresent(`@somReviewsPopup${ml}`);
  },
};

const milestonePage: PageObjectModel = {
  commands: [milestonePageCommands],
  elements: {
    newSomPopup: {
      selector: '.new-som-popup',
    },
    titleInput: {
      selector: '[model="title"] input'
    },
    outputsInput: {
      selector: '[model="outputs"] .ql-editor'
    },
    successCriteriaInput: {
      selector: '[model="success_criteria"] .ql-editor'
    },
    evidenceInput: {
      selector: '[model="evidence"] .ql-editor'
    },
    costInput: {
      selector: '[model="cost"] input'
    },
    monthInput: {
      selector: '[model="month"] select'
    },
    monthOption: {
      selector: '[model="month"] select option[value="4"]'
    },
    completionInput: {
      selector: '[model="completion"] .b-slider-thumb-wrapper'
    },
    submitSomInput: {
      selector: '.new-som-popup form button[type="submit"]',
    },
    resetSomInput: {
      selector: '.new-som-popup form button[type="button"]',
    },
    cloneSomInput: {
      selector: '.new-som-popup .card-header-title button[type="button"]',
    }
  }
};

// Dynamic fields generation
// List of milestones

const mls = [1, 2, 3, 4, 5]
// Fields for SoM
const mlFields = ['title', 'outputs', 'success_criteria', 'evidence', 'month', 'cost', 'completion']

// Fields for SoM review
const mlReviewFields = ['outputs', 'success_criteria', 'evidence']

mls.forEach((ml) => {
  const mlEl = `[data-id="tab-${ml}"]`
  let mlSelectors: Record<string, any> = {}

  // For SoM
  mlFields.forEach((field) => {
    mlSelectors[`${field}${ml}`] = `${mlEl} .som-recap .som-${field}`
  })
  mlSelectors[`newSomButton${ml}`] = `${mlEl} .new-som`

  // For SoM review
  mlReviewFields.forEach((field) => {
    const somReviewsFieldsEls = {
      [`${field}_approved${ml}`]: `${mlEl} .new-som-review [model="${field}_approves"] .checkbox`,
      [`${field}_comment${ml}`]: `${mlEl} .new-som-review [model="${field}_comment"] .ql-editor`,
      [`lastSomReview${field}_approved${ml}`]: `${mlEl} .som-reviews-popup .reviews:nth-child(1) .${field}_approves`,
      [`lastSomReview${field}_comment${ml}`]: `${mlEl} .som-reviews-popup .reviews:nth-child(1) .${field}_comment`
    }
    Object.assign(mlSelectors, somReviewsFieldsEls)
  })
  const somReviewsEls = {
    [`newSomReviewButton${ml}`]: `${mlEl} .new-som-review-button`,
    [`newSomReview${ml}`]: `${mlEl} .new-som-review` ,
    [`submitSomReview${ml}`]: `${mlEl} .new-som-review-submit`,
    [`showSomReviews${ml}`]: `${mlEl} .show-som-reviews`,
    [`somReviewsPopup${ml}`]: `${mlEl} .som-reviews-popup`,
    [`somReviewsPopupClose${ml}`]: `${mlEl} .som-reviews-popup .modal-close`,
    [`lastSomReview${ml}`]: `${mlEl} .som-reviews-popup reviews:first-child`
  }
  Object.assign(mlSelectors, somReviewsEls)

  // Shape the selector object for the fields
  Object.keys(mlSelectors).forEach((k) => {
    if (milestonePage.elements) {
      milestonePage.elements[k] = {
        selector: mlSelectors[k]
      }
    }
  })
})

export default milestonePage;

export interface MilestonePage
  extends EnhancedPageObject<
    typeof milestonePageCommands,
    typeof milestonePage.elements
  > {}
