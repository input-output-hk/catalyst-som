import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { MilestonePage } from '../page-objects/milestonePage';
import { LoginPage } from '../page-objects/loginPage';
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
  loginPage.navigate().loginAs(user);
  browser.navigateTo(milestoneUrl(proposalId, milestoneId));
  milestonePage.assert.elementPresent(`@newSomSignoff${milestoneId}`);
  milestonePage.openSomSignoff(milestoneId).submitSomSignoff(milestoneId)
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
  milestonePage.assert.not.elementPresent(`@newSomSignoff${milestoneId}`);
  loginPage.logout();
}

const somReviewSubmissionTest: NightwatchTests = {
  tags: ['signoff'],
  before: async function(this: NightwatchTests, browser: NightwatchBrowser) {
    browser.resizeWindow(1280, 800);
    this.count = {}
    await prepareNotificationsCount(
      browser,
      'proposer-2',
      this.count,
      'signoffReceivedNotifications'
    )
    await prepareNotificationsCount(
      browser,
      'proposer-1',
      this.count,
      'signoffReceivedNotifications'
    )
  },
  'Signoff user signoff'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900002, 5, 'signoff')
    goCantSubmit(browser, 900002, 1, 'signoff')
    goCantSubmit(browser, 900003, 2, 'signoff')
    goCantSubmit(browser, 900003, 3, 'signoff')
  },
  'Admin signoff'(browser: NightwatchBrowser) {
    fillAndSubmit(browser, 900003, 5, 'admin')
    goCantSubmit(browser, 900002, 1, 'admin')
    goCantSubmit(browser, 900003, 2, 'admin')
    goCantSubmit(browser, 900003, 3, 'admin')
  },
  'IO signoff'(browser: NightwatchBrowser) {
    goCantSubmit(browser, 900002, 1, 'iog')
    goCantSubmit(browser, 900002, 4, 'iog')
    goCantSubmit(browser, 900003, 1, 'iog')
    goCantSubmit(browser, 900003, 4, 'iog')
  },
  'CT 1 signoff'(browser: NightwatchBrowser) {
    goCantSubmit(browser, 900002, 1, 'challenge-team-1')
    goCantSubmit(browser, 900002, 4, 'challenge-team-1')
    goCantSubmit(browser, 900003, 1, 'challenge-team-1')
    goCantSubmit(browser, 900003, 4, 'challenge-team-1')
  },
  'Proposer 1 signoff'(browser: NightwatchBrowser) {
    goCantSubmit(browser, 900002, 1, 'proposer-1')
    goCantSubmit(browser, 900002, 4, 'proposer-1')
    goCantSubmit(browser, 900003, 1, 'proposer-1')
    goCantSubmit(browser, 900003, 4, 'proposer-1')
  },
  'Proposer 2 signoff'(browser: NightwatchBrowser) {
    goCantSubmit(browser, 900002, 1, 'proposer-2')
    goCantSubmit(browser, 900002, 4, 'proposer-2')
    goCantSubmit(browser, 900003, 1, 'proposer-2')
    goCantSubmit(browser, 900003, 4, 'proposer-2')
  },
  'Proposer 2 signoff notification'(this: NightwatchTests, browser: NightwatchBrowser) {
    checkNotifications(browser, 'proposer-1', this.count, '@signoffReceivedNotifications', 1)
    checkNotifications(browser, 'proposer-2', this.count, '@signoffReceivedNotifications', 1)
  },
};

export default somReviewSubmissionTest;
