import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { MilestonePage } from '../page-objects/milestonePage';
import { LoginPage } from '../page-objects/loginPage';
import { stringSeed, stringBase, numberSeed, numberBase } from '../utils/seeds'

const milestoneUrl = (proposalId: number, milestoneId: number) => {
  return `http://localhost:5173/proposals/${proposalId}/milestones/${milestoneId}`
}

const fillAndResubmit = (
  browser: NightwatchBrowser,
  proposalId: number,
  milestoneId: number,
  user: String
) => {
  const loginPage = browser.page.loginPage();
  const milestonePage = browser.page.milestonePage();
  const sSeed = stringSeed();
  loginPage.navigate().loginAs(user);
  browser.navigateTo(milestoneUrl(proposalId, milestoneId));
  milestonePage.assert.elementPresent(`@newPoA${milestoneId}`);
  milestonePage.startPoAResubmission(milestoneId).fillPoA(milestoneId, sSeed)
    .submitPoA(milestoneId)
    .expect.element(`@currentPoAContent${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
  loginPage.logout();
}

const fillAndSubmit = (
  browser: NightwatchBrowser,
  proposalId: number,
  milestoneId: number,
  user: String
) => {
  const loginPage = browser.page.loginPage();
  const milestonePage = browser.page.milestonePage();
  const sSeed = stringSeed();
  loginPage.navigate().loginAs(user);
  browser.navigateTo(milestoneUrl(proposalId, milestoneId));
  milestonePage.assert.elementPresent(`@newPoA${milestoneId}`);
  milestonePage.startPoASubmission(milestoneId).fillPoA(milestoneId, sSeed)
    .submitPoA(milestoneId)
    .expect.element(`@currentPoAContent${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
  loginPage.logout();
}

const goCantSubmit = (
  browser: NightwatchBrowser,
  proposalId: number,
  milestoneId: number,
  user: String
) => {
  const loginPage = browser.page.loginPage();
  const milestonePage = browser.page.milestonePage()
  loginPage.navigate().loginAs(user);
  browser.navigateTo(milestoneUrl(proposalId, milestoneId));
  milestonePage.assert.not.elementPresent(`@newPoA${milestoneId}`);
  loginPage.logout();
}

const poaSubmissionTest: NightwatchTests = {
  tags: ['poa'],
  before(this: NightwatchTests, browser: NightwatchBrowser) {
    browser.resizeWindow(1280, 800);
  },
  'Proposer 1 PoA submission'(browser: NightwatchBrowser) {
    fillAndResubmit(browser, 900002, 2, 'proposer-1')
  },
  'Proposer 1 fail PoA submission'(browser: NightwatchBrowser) {
    goCantSubmit(browser, 900002, 1, 'proposer-1')
    goCantSubmit(browser, 900002, 4, 'proposer-1')
    goCantSubmit(browser, 900003, 2, 'proposer-1')
  },
  'Admin PoA submissions'(browser: NightwatchBrowser) {
    fillAndResubmit(browser, 900002, 2, 'admin')
    fillAndSubmit(browser, 900003, 3, 'admin')
    goCantSubmit(browser, 900002, 1, 'admin')
    goCantSubmit(browser, 900002, 4, 'admin')
    goCantSubmit(browser, 900003, 1, 'admin')
    goCantSubmit(browser, 900003, 4, 'admin')
  },
  'CT PoA submissions': () => {
    goCantSubmit(browser, 900002, 1, 'challenge-team-1')
    goCantSubmit(browser, 900002, 4, 'challenge-team-2')
  },
  'IO PoA submissions': () => {
    goCantSubmit(browser, 900002, 1, 'iog')
    goCantSubmit(browser, 900002, 4, 'iog')
  },
  'Signoff PoA submissions': () => {
    goCantSubmit(browser, 900002, 1, 'signoff')
    goCantSubmit(browser, 900002, 4, 'signoff')
    browser.end();
  }
};

export default poaSubmissionTest;
