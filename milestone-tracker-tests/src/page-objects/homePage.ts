import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const homePageCommands = {
  clickDiscoverProposals(this: HomePage) {
    return this.waitForElementVisible('@discoverProposals', 10000)
      .click('@discoverProposals')
      .waitForElementNotPresent('@discoverProposals');
  },
  clickNavProposals(this: HomePage) {
    return this.waitForElementPresent('@navProposals', 10000)
      .click('@navProposals');
  },
  clickNavLogin(this: HomePage) {
    return this.waitForElementPresent('@navLogin', 10000)
      .click('@navLogin');
  },
};

const homePage: PageObjectModel = {
  url: 'http://localhost:5173',
  commands: [homePageCommands],
  elements: {
    discoverProposals: {
      selector: 'a.discover-proposals',
    },
    navProposals: {
      selector: '#main-nav .navbar-start a:nth-child(2)'
    },
    navLogin: {
      selector: '#main-nav .navbar-start a:nth-child(3)'
    }
  }
};

export default homePage;

export interface HomePage
  extends EnhancedPageObject<
    typeof homePageCommands,
    typeof homePage.elements
  > {}
