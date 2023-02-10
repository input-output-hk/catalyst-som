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
  }
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
const mlFields = ['title', 'outputs', 'success_criteria', 'evidence', 'month', 'cost', 'completion']
const mls = [1, 2, 3, 4, 5]


mls.forEach((ml) => {
  mlFields.forEach((field) => {
    if (milestonePage.elements) {
      milestonePage.elements[`${field}${ml}`] = {
        selector: `[data-id="tab-${ml}"] .som-recap .som-${field}`
      }
    }
  })
  if (milestonePage.elements) {
    milestonePage.elements[`newSomButton${ml}`] = {
      selector: `[data-id="tab-${ml}"] .new-som`
    }
  }
})

export default milestonePage;

export interface MilestonePage
  extends EnhancedPageObject<
    typeof milestonePageCommands,
    typeof milestonePage.elements
  > {}
