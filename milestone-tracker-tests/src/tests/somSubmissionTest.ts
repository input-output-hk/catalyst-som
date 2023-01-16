import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { MilestonePage } from '../page-objects/milestonePage';
import { LoginPage } from '../page-objects/loginPage';

const milestoneUrl = (proposalId: number, milestoneId: number) => {
  return `http://localhost:5173/proposals/${proposalId}/milestones/${milestoneId}`
}

const somSubmissionTest: NightwatchTests = {
  'Proposer 1 Login': (browser: NightwatchBrowser) => {
    browser.resizeWindow(1280, 800);
    const loginPage: LoginPage = browser.page.loginPage();

    loginPage
      .navigate()
      .loginAsProposer1()

    browser.assert.urlContains('/proposals');
  },
  'Proposer 1 SoM submission': (browser: NightwatchBrowser) => {
    const milestonePage: MilestonePage = browser.page.milestonePage();

    browser.navigateTo(milestoneUrl(900002, 1));

    milestonePage.assert.elementPresent('@newSomButton');

    milestonePage.startSomSubmission().fillSom().submitSom()

  },
  'Proposer 1 fail SoM submission': (browser: NightwatchBrowser) => {
    const milestonePage: MilestonePage = browser.page.milestonePage();

    // Navigate to a proposal not owned
    browser.navigateTo(milestoneUrl(900001, 1));

    milestonePage.assert.elementNotPresent('@newSomButton');

    browser.end();
  }
};

export default somSubmissionTest;
