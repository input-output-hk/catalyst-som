import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const homePageCommands = {
  clickDiscoverProposals(this: HomePage) {
    return this.waitForElementVisible('@discoverProposals', 10000)
      .click('@discoverProposals')
      .waitForElementNotPresent('@discoverProposals');
  },
};

const homePage: PageObjectModel = {
  url: 'http://localhost:5173',
  commands: [homePageCommands],
  elements: {
    discoverProposals: {
      selector: 'button[type=button]',
    }
  }
};

export default homePage;

export interface HomePage
  extends EnhancedPageObject<
    typeof homePageCommands,
    typeof homePage.elements
  > {}
