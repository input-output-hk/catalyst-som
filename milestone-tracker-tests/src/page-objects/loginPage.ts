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
    return this.login('admin@example.org', 'ciaociao1')
  },

  loginAsProposer1(this: LoginPage) {
    return this.login('proposer-1@example.org', 'ciaociao1')
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
    }
  }
};

export default loginPage;

export interface LoginPage
  extends EnhancedPageObject<
    typeof loginPageCommands,
    typeof loginPage.elements
  > {}
