import { PageObjectModel, EnhancedPageObject } from 'nightwatch';

const notificationsPageCommands = {
  async getCurrentNotificationsCount(this: NotificationsPage, el: string) {
    this.navigate()
    this.waitForElementPresent(`@${el}`, 10000)
    const count = new Promise(resolve => {
      this.api.elements(
        this.elements[el].locateStrategy,
        this.elements[el].selector,
        (res: any) => {
        resolve(res.value.length)
      })
    })
    return count
  }
};

const notificationsPage: PageObjectModel = {
  url: 'http://localhost:5173/notifications',
  commands: [notificationsPageCommands],
  elements: {
    somToReviewNotifications: {
      selector: '.som-to-review-notifications tr',
    },
    poaToReviewNotifications: {
      selector: '.poa-to-review-notifications tr',
    },
    signoffReceivedNotifications: {
      selector: '.signoff-received-notifications tr',
    },
    somReviewsNotifications: {
      selector: '.som-reviews-received-notifications tr',
    },
    poaReviewsNotifications: {
      selector: '.poa-reviews-received-notifications tr',
    }
  }
};

export default notificationsPage;

export interface NotificationsPage
  extends EnhancedPageObject<
    typeof notificationsPageCommands,
    typeof notificationsPage.elements
  > {}
