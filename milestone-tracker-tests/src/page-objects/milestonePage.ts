import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const milestonePageCommands = {
  startSomSubmission(this: MilestonePage) {
    return this.waitForElementVisible('@newSomButton', 10000)
      .click('@newSomButton')
      .waitForElementVisible('@newSomPopup', 10000)
  },
  fillSom(this: MilestonePage) {
    return this.waitForElementVisible('@titleInput', 10000)
      .waitForElementVisible('@outputsInput', 10000)
      .waitForElementVisible('@successCriteriaInput', 10000)
      .waitForElementVisible('@evidenceInput', 10000)
      .waitForElementVisible('@costInput', 10000)
      .waitForElementVisible('@monthInput', 10000)
      .waitForElementVisible('@completionInput', 10000)
      .setValue('@titleInput', 'Lorem ipsum')
      .click('@outputsInput')
      .sendKeys('@outputsInput', 'Lorem ipsum')
      .click('@successCriteriaInput')
      .sendKeys('@successCriteriaInput', 'Lorem ipsum')
      .click('@evidenceInput')
      .sendKeys('@evidenceInput', 'Lorem ipsum')
      .setValue('@costInput', '1000')
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
    newSomButton: {
      selector: '.new-som',
    },
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

export default milestonePage;

export interface MilestonePage
  extends EnhancedPageObject<
    typeof milestonePageCommands,
    typeof milestonePage.elements
  > {}
