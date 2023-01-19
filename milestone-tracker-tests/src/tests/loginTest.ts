import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { LoginPage } from '../page-objects/loginPage';

const logout = (browser: NightwatchBrowser, page: LoginPage) => {
  page
    .logout()
    .expect.element('body')
    .text.to.contain('Login')
  page.assert.not.elementPresent('#main-nav .navbar-start a:nth-child(5)');
  browser.assert.urlContains('/login');
}

const loginTest: NightwatchTests = {
  'Admin Login test': (browser: NightwatchBrowser) => {
    browser.resizeWindow(1280, 800);
    const loginPage: LoginPage = browser.page.loginPage();

    loginPage
      .navigate()
      .assert.titleEquals('Project Catalyst - Milestone Module');

    loginPage
      .loginAsAdmin()
      .expect.element('body')
      .text.to.contain('Logout admin@example.org')

    loginPage.assert.elementPresent('#main-nav .navbar-start a:nth-child(5)');
    browser.assert.urlContains('/proposals');

    logout(browser, loginPage)

  },
  'Proposer 1 Login test': (browser: NightwatchBrowser) => {
    browser.resizeWindow(1280, 800);
    const loginPage: LoginPage = browser.page.loginPage();

    loginPage
      .loginAsProposer1()
      .expect.element('body')
      .text.to.contain('Logout proposer-1@example.org')

    loginPage.assert.not.elementPresent('#main-nav .navbar-start a:nth-child(5)');
    browser.assert.urlContains('/proposals');

    logout(browser, loginPage)

    browser.end();
  }
};

export default loginTest;
