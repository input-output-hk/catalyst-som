import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { MilestonePage } from '../page-objects/milestonePage';
import { LoginPage } from '../page-objects/loginPage';
import { stringSeed, stringBase, numberSeed, numberBase } from '../utils/seeds'

const milestoneUrl = (proposalId: number, milestoneId: number) => {
  return `http://localhost:5173/proposals/${proposalId}/milestones/${milestoneId}`
}

const checkBudgetError = (browser: NightwatchBrowser, milestonePage: MilestonePage) => {
  browser.elements('css selector', '.modal.is-active.budget-error', (res) => {
    if (Object.keys(res.value).length > 0) {
      milestonePage.dismissBudgetError()
    }
  })
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
  const nSeed = numberSeed();
  loginPage.navigate().loginAs(user);
  browser.navigateTo(milestoneUrl(proposalId, milestoneId));
  milestonePage.assert.elementPresent(`@newSomButton${milestoneId}`);
  checkBudgetError(browser, milestonePage)
  milestonePage.startSomResubmission(milestoneId).fillSom(sSeed, nSeed).submitSom()
    .expect.element(`@title${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .expect.element(`@outputs${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .expect.element(`@success_criteria${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .expect.element(`@evidence${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    //.expect.element(`@cost${ml}`).text.to.contain(`${numberBase+nSeed}`)
  checkBudgetError(browser, milestonePage)
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
  const nSeed = numberSeed();
  loginPage.navigate().loginAs(user);
  browser.navigateTo(milestoneUrl(proposalId, milestoneId));
  milestonePage.assert.elementPresent(`@newSomButton${milestoneId}`);
  checkBudgetError(browser, milestonePage)
  milestonePage.startSomSubmission(milestoneId).fillSom(sSeed, nSeed).submitSom()
    .expect.element(`@title${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .expect.element(`@outputs${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .expect.element(`@success_criteria${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    .expect.element(`@evidence${milestoneId}`).text.to.contain(`${stringBase}${sSeed}`)
    //.expect.element(`@cost${ml}`).text.to.contain(`${numberBase+nSeed}`)
  checkBudgetError(browser, milestonePage)
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
  milestonePage.assert.not.elementPresent(`@newSomButton${milestoneId}`);
  loginPage.logout();
}

const somSubmissionTest: NightwatchTests = {
  tags: ['som'],
  before(this: NightwatchTests, browser: NightwatchBrowser) {
    browser.resizeWindow(1280, 800);
  },
  'Proposer 1 SoM submission'(browser: NightwatchBrowser) {
    fillAndResubmit(browser, 900002, 4, 'proposer-1') // resubmission
  },
  'Proposer 1 fail SoM submission'(browser: NightwatchBrowser) {
    // submit a som in proposals not owned, always fails
    goCantSubmit(browser, 900003, 1, 'proposer-1')
    goCantSubmit(browser, 900005, 2, 'proposer-1')
    goCantSubmit(browser, 900007, 3, 'proposer-1')
    goCantSubmit(browser, 900008, 4, 'proposer-1')
  },
  'Admin SoM submissions'(browser: NightwatchBrowser) {
    // submit a som in each proposal, can't fail
    fillAndResubmit(browser, 900002, 4, 'admin') // resubmission
    fillAndResubmit(browser, 900003, 4, 'admin') // resubmission
    fillAndSubmit(browser, 900007, 2, 'admin') // submission
  },
  'CT SoM submissions': () => {
    // submit a som in each proposal, always fails
    goCantSubmit(browser, 900003, 1, 'challenge-team-1')
    goCantSubmit(browser, 900005, 2, 'challenge-team-1')
    goCantSubmit(browser, 900007, 3, 'challenge-team-1')
    goCantSubmit(browser, 900008, 4, 'challenge-team-1')
  },
  'IO SoM submissions': () => {
    // submit a som in each proposal, always fails
    goCantSubmit(browser, 900003, 1, 'iog')
    goCantSubmit(browser, 900005, 2, 'iog')
    goCantSubmit(browser, 900007, 3, 'iog')
    goCantSubmit(browser, 900008, 4, 'iog')
  },
  'Signoff SoM submissions': () => {
    // submit a som in each proposal, always fails
    goCantSubmit(browser, 900003, 1, 'signoff')
    goCantSubmit(browser, 900005, 2, 'signoff')
    goCantSubmit(browser, 900007, 3, 'signoff')
    goCantSubmit(browser, 900008, 4, 'signoff')
    browser.end();
  }
};

export default somSubmissionTest;
