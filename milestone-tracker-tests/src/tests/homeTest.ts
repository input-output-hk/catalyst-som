import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { HomePage } from '../page-objects/homePage';

const googleTest: NightwatchTests = {
  'Google search test': (browser: NightwatchBrowser) => {
    const homePage: HomePage = browser.page.homePage();

    homePage
      .navigate()
      .assert.titleEquals('Project Catalyst - Milestone Module');

    homePage
      .clickDiscoverProposals()
      .expect.element('body')
      .text.to.contain(
        'All the proposals in the Statement of Milestone pilot.'
      );

    browser.end();
  }
};

export default googleTest;
