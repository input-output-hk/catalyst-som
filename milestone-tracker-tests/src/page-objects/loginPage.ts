import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const loginPageCommands = {
  login(this: LoginPage, username: string, password: string) {
    return this.waitForElementVisible('@emailInput', 10000)
      .waitForElementVisible('@passwordInput', 10000)
      .waitForElementVisible('@loginButton', 10000)
      .waitForElementVisible('@resetButton', 10000)
      .setValue('@emailInput', username)
      .setValue('@passwordInput', password)
      .click('@loginButton')
  },

  loginAsAdmin(this: LoginPage) {
    return this.loginAs('admin')
  },

  loginAs(this: LoginPage, name: String) {
    return this.login(`${name}@example.org`, 'ciaociao1')
      .waitForElementPresent('@logoutButton');
  },

  logout(this: LoginPage) {
    return this.waitForElementVisible('@logoutButton', 10000)
      .click('@logoutButton')
      .waitForElementNotPresent('@logoutButton');
  }
};

const loginPage: PageObjectModel = {
  url: 'http://localhost:5173/login',
  commands: [loginPageCommands],
  elements: {
    emailInput: {
      selector: 'input[type="email"]',
    },
    passwordInput: {
      selector: 'input[type="password"]',
    },
    loginButton: {
      selector: 'button.login'
    },
    resetButton: {
      selector: 'button.reset'
    },
    logoutButton: {
      selector: '#main-nav span.logout'
    },
    adminButton: {
      selector: '#main-nav .navbar-start a:nth-child(5)'
    }
  }
};

export default loginPage;

export interface LoginPage
  extends EnhancedPageObject<
    typeof loginPageCommands,
    typeof loginPage.elements
  > {}
