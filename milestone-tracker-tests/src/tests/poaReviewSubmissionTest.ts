import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { MilestonePage } from '../page-objects/milestonePage';
import { LoginPage } from '../page-objects/loginPage';
import { stringSeed, stringBase, numberSeed, numberBase } from '../utils/seeds'
import { prepareNotificationsCount, checkNotifications } from '../utils/notifications'

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
  milestonePage.assert.elementPresent(`@newPoAReview${milestoneId}`);
  milestonePage.startPoAReviewSubmission(milestoneId)
    .fillPoAReview(milestoneId, sSeed)
    .submitPoAReview(milestoneId)
    .openPoAReviews(milestoneId)
    .expect.element(`@poAReviewContent${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .closePoAReviews(milestoneId)
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
  milestonePage.assert.not.elementPresent(`@newPoAReview${milestoneId}`);
  loginPage.logout();
}

const poaReviewSubmissionTest: NightwatchTests = {
  tags: ['poa-review'],
  before: async function(this: NightwatchTests, browser: NightwatchBrowser) {
    browser.resizeWindow(1280, 800);
    this.count = {}
    await prepareNotificationsCount(
      browser,
      'proposer-2',
      this.count,
      'poaReviewsNotifications'
    )
    await prepareNotificationsCount(
      browser,
      'proposer-1',
      this.count,
      'poaReviewsNotifications'
    )
  },
  'CT 1 PoA Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 2, 'challenge-team-1')
    goCantSubmit(browser, 900002, 1, 'challenge-team-1')
    goCantSubmit(browser, 900002, 3, 'challenge-team-1')
    goCantSubmit(browser, 900002, 4, 'challenge-team-1')
  },
  'CT 2 PoA Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900003, 2, 'challenge-team-2')
    goCantSubmit(browser, 900003, 1, 'challenge-team-2')
    goCantSubmit(browser, 900003, 3, 'challenge-team-2')
    goCantSubmit(browser, 900003, 4, 'challenge-team-2')
  },
  'IO PoA Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 2, 'iog')
    fillAndSubmit(browser, 900003, 2, 'iog')
    goCantSubmit(browser, 900002, 3, 'iog')
    goCantSubmit(browser, 900003, 1, 'iog')
  },
  'Admin PoA Review submission'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 2, 'iog')
    fillAndSubmit(browser, 900003, 2, 'iog')
    goCantSubmit(browser, 900002, 3, 'iog')
    goCantSubmit(browser, 900003, 1, 'iog')
  },
  'Proposer 2 notifications'(this: NightwatchTests, browser: NightwatchBrowser) {
    checkNotifications(browser, 'proposer-2', this.count, '@poaReviewsNotifications', 3)
    checkNotifications(browser, 'proposer-1', this.count, '@poaReviewsNotifications', 3)
  },
  'Proposer 2 PoA Review submission'(browser: NightwatchBrowser) {
    goCantSubmit(browser, 900002, 2, 'proposer-2')
    goCantSubmit(browser, 900003, 2, 'proposer-2')
  },
};

export default poaReviewSubmissionTest;
