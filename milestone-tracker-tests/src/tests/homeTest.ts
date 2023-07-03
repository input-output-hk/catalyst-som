import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { HomePage } from '../page-objects/homePage';

const homeTest: NightwatchTests = {
  tags: ['home'],
  'Home test': (browser: NightwatchBrowser) => {
    browser.resizeWindow(1280, 800);
    const homePage: HomePage = browser.page.homePage();

    homePage
      .navigate()
      .assert.titleEquals('Project Catalyst - Milestone Module');

    homePage
      .clickDiscoverProposals()
      .expect.element('body')
      .text.to.contain(
        'All the projects in the Statement of Milestone pilot.'
      );

    browser.assert.urlContains('/proposals');

    homePage
      .clickNavProposals()
      .expect.element('body')
      .text.to.contain(
        'All the projects in the Statement of Milestone pilot.'
      );

    browser.assert.urlContains('/proposals');

    homePage
      .clickNavLogin()
      .expect.element('body')
      .text.to.contain(
        'Login as Funded Proposer, Challenge Team member or Catalyst team member to interact with milestones.'
      );

    browser.assert.urlContains('/login');

    browser.end();
  }
};

export default homeTest;
