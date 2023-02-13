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

const somReviewSubmissionTest: NightwatchTests = {
  tags: ['som-review'],
  before(this: NightwatchTests, browser: NightwatchBrowser) {
    browser.resizeWindow(1280, 800);
  },
  'CT 1 SoM Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 4, 'challenge-team-1')
  },
  'CT 2 SoM Review submission'(browser: NightwatchBrowser) {
  },
  'IO SoM Review submission'(browser: NightwatchBrowser) {
  },
  'Admin SoM Review submission'(browser: NightwatchBrowser) {
  },
  'Proposer 2 notifications'(browser: NightwatchBrowser) {
  },
  'Proposer 2 SoM Review submission'(browser: NightwatchBrowser) {
  },
};

export default somReviewSubmissionTest;
