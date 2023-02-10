import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { LoginPage } from '../page-objects/loginPage';

const logout = (browser: NightwatchBrowser, page: LoginPage) => {
  page
    .logout()
    .expect.element('body')
    .text.to.contain('Login')
  page.assert.not.elementPresent('@adminButton');
  browser.assert.urlContains('/login');
}

const loginTest: NightwatchTests = {
  tags: ['login'],
  'Login tests': (browser: NightwatchBrowser) => {
    browser.resizeWindow(1280, 800);
    const loginPage: LoginPage = browser.page.loginPage();

    const users = [
      'admin',
      'proposer-1',
      'proposer-2',
      'challenge-team-1',
      'challenge-team-2',
      'iog',
      'signoff'
    ];

    loginPage
      .navigate()
      .assert.titleEquals('Project Catalyst - Milestone Module');

    users.forEach((user) => {
      loginPage.navigate();
      loginPage
        .loginAs(user)
        .expect.element('body')
        .text.to.contain(`Logout ${user}@example.org`)
      if (user === 'admin') {
        loginPage.assert.elementPresent('@adminButton');
      } else {
        loginPage.assert.not.elementPresent('@adminButton');
      }
      browser.assert.urlContains('/proposals');
      logout(browser, loginPage)
    })
    browser.end();
  }
};

export default loginTest;
