import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { MilestonePage } from '../page-objects/milestonePage';
import { LoginPage } from '../page-objects/loginPage';
import { stringSeed, stringBase, numberSeed, numberBase } from '../utils/seeds.js'

const milestoneUrl = (proposalId: number, milestoneId: number) => {
  return `http://localhost:5173/proposals/${proposalId}/milestones/${milestoneId}`
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
  milestonePage.assert.elementPresent(`@newSomReviewButton${milestoneId}`);
  milestonePage.startSomReviewSubmission(milestoneId)
    .fillSomReview(milestoneId, sSeed)
    .submitSomReview(milestoneId)
    .openSomReviews(milestoneId)
    .expect.element(`@lastSomReviewoutputs_approved${milestoneId}`).text.to.contain('Approved')
    .expect.element(`@lastSomReviewsuccess_criteria_approved${milestoneId}`).text.to.contain('Not Approved')
    .expect.element(`@lastSomReviewsuccess_criteria_comment${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .expect.element(`@lastSomReviewevidence_approved${milestoneId}`).text.to.contain('Approved')
    .expect.element(`@lastSomReviewevidence_comment${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .closeSomReviews(milestoneId)
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
  milestonePage.assert.not.elementPresent(`@newSomReviewButton${milestoneId}`);
  loginPage.logout();
}

const somReviewSubmissionTest: NightwatchTests = {
  tags: ['som-review'],
  before(this: NightwatchTests, browser: NightwatchBrowser) {
    browser.resizeWindow(1280, 800);
  },
  'CT 1 SoM Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 4, 'challenge-team-1')
    goCantSubmit(browser, 900002, 1, 'challenge-team-1')
    goCantSubmit(browser, 900002, 2, 'challenge-team-1')
    goCantSubmit(browser, 900003, 4, 'challenge-team-1')
  },
  'CT 2 SoM Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900003, 4, 'challenge-team-2')
    goCantSubmit(browser, 900002, 1, 'challenge-team-2')
    goCantSubmit(browser, 900002, 2, 'challenge-team-2')
    goCantSubmit(browser, 900002, 4, 'challenge-team-2')
  },
  'IO SoM Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 4, 'iog')
    goCantSubmit(browser, 900002, 1, 'iog')
    fillAndSubmit(browser, 900003, 4, 'iog')
    goCantSubmit(browser, 900003, 1, 'iog')
  },
  'Admin SoM Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 4, 'admin')
    goCantSubmit(browser, 900002, 1, 'admin')
    fillAndSubmit(browser, 900003, 4, 'admin')
    goCantSubmit(browser, 900003, 1, 'admin')
  },
  'Proposer 2 notifications'(browser: NightwatchBrowser) {
  },
  'Proposer 2 SoM Review submission'(browser: NightwatchBrowser) {
  },
};

export default somReviewSubmissionTest;
