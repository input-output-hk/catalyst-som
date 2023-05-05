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
      .dragAndDrop('@completionInput', {x: 400, y: 0})
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
  openSomSignoff(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@newSomSignoff${ml}`, 10000)
      .click(`@newSomSignoff${ml}`)
      .waitForElementPresent(`@signoffPopup${ml}`);
  },
  submitSomSignoff(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@signoffSubmit${ml}`, 10000)
      .click(`@signoffSubmit${ml}`)
      .waitForElementNotPresent(`@signoffPopup${ml}`);
  },
  startPoASubmission(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@newPoA${ml}`, 10000)
      .click(`@newPoA${ml}`)
      .waitForElementPresent(`@newPoAPopup${ml}`);
  },
  fillPoA(this: MilestonePage, ml: number, stringSeed: String) {
    return this.waitForElementVisible(`@newPoAContent${ml}`, 10000)
      .waitForElementVisible(`@newPoASubmit${ml}`, 10000)
      .click(`@newPoAContent${ml}`)
      .sendKeys(`@newPoAContent${ml}`, `${stringBase}${stringSeed}`)
  },
  submitPoA(this: MilestonePage, ml: number, stringSeed: String) {
    return this.waitForElementVisible(`@newPoASubmit${ml}`, 10000)
      .click(`@newPoASubmit${ml}`)
      .waitForElementNotVisible(`@newPoAPopup${ml}`)
      .waitForElementPresent(`@currentPoA${ml}`)
      .waitForElementPresent(`@currentPoAContent${ml}`);
  },
  startPoAReviewSubmission(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@newPoAReview${ml}`, 10000)
      .click(`@newPoAReview${ml}`)
      .waitForElementPresent(`@newPoAReviewPopup${ml}`);
  },
  fillPoAReview(this: MilestonePage, ml: number, stringSeed: String) {
    return this.waitForElementVisible(`@newPoAReviewContent${ml}`, 10000)
      .waitForElementVisible(`@newPoAReviewSubmit${ml}`, 10000)
      .click(`@newPoAReviewContent${ml}`)
      .sendKeys(`@newPoAReviewContent${ml}`, `${stringBase}${stringSeed}`)
  },
  submitPoAReview(this: MilestonePage, ml: number, stringSeed: String) {
    return this.waitForElementVisible(`@newPoAReviewSubmit${ml}`, 10000)
      .click(`@newPoAReviewSubmit${ml}`)
      .waitForElementNotPresent(`@newPoAReviewPopup${ml}`)
      .waitForElementPresent(`@poAReviewContent${ml}`);
  },
  openPoAReviews(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@poAReviewShowButton${ml}`, 10000)
      .click(`@poAReviewShowButton${ml}`)
      .waitForElementPresent(`@poAReviewContent${ml}`);
  },
  closePoAReviews(this: MilestonePage, ml: number) {
    return this.waitForElementVisible(`@poAReviewShowButton${ml}`, 10000)
      .click(`@poAReviewShowButton${ml}`)
      .waitForElementNotVisible(`@poAReviewContent${ml}`);
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


  // For SoM Signoff
  mlSelectors[`newSomSignoff${ml}`] = `${mlEl} .new-som-signoff`
  mlSelectors[`signoffPopup${ml}`] = `${mlEl} .new-signoff-popup`
  mlSelectors[`signoffSubmit${ml}`] = `${mlEl} .submit-signoff`

  // For PoA submission
  mlSelectors[`newPoA${ml}`] = `${mlEl} .new-poa`
  mlSelectors[`newPoAPopup${ml}`] = `${mlEl} .new-poa-popup`
  mlSelectors[`newPoAContent${ml}`] = `${mlEl} .new-poa-popup [model="content"] .ql-editor`,
  mlSelectors[`newPoASubmit${ml}`] = `${mlEl} .new-poa-submit`
  mlSelectors[`currentPoA${ml}`] = `${mlEl} .current-poa`
  mlSelectors[`currentPoAContent${ml}`] = `${mlEl} .current-poa .poa-content`

  // For PoA Review submission
  mlSelectors[`newPoAReview${ml}`] = `${mlEl} .new-poa-review-button`
  mlSelectors[`newPoAReviewPopup${ml}`] = `${mlEl} .new-poa-review-popup`
  mlSelectors[`newPoAReviewContent${ml}`] = `${mlEl} .new-poa-review-popup [model="content_comment"] .ql-editor`
  mlSelectors[`newPoAReviewSubmit${ml}`] = `${mlEl} .new-poa-review-submit`
  mlSelectors[`poAReviewShowButton${ml}`] = `${mlEl} .current-poa .open-poa-reviews`
  mlSelectors[`poAReviewContent${ml}`] = `${mlEl} .current-poa .single-poa-review:last-child .poa-review-content`

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
