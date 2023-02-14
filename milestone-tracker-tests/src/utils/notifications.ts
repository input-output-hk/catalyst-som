import { NightwatchBrowser } from 'nightwatch';

const prepareNotificationsCount = async (
  browser: NightwatchBrowser, user: string, count: {[k: string]: any}, element: String
) => {
  const loginPage = browser.page.loginPage();
  const notificationsPage = browser.page.notificationsPage()
  loginPage.navigate().loginAs(user);
  const result = await notificationsPage.getCurrentNotificationsCount(element)
  loginPage.logout();
  count[`${user}@${element}`] = result
}


const checkNotifications = (
  browser: NightwatchBrowser,
  user: string,
  count: {[k: string]: any},
  element: string,
  offset: number,
) => {
  const loginPage = browser.page.loginPage();
  const notificationsPage = browser.page.notificationsPage()
  loginPage.navigate().loginAs(user);
  notificationsPage.navigate()
  notificationsPage.assert.elementsCount(
    element,
    count[`${user}${element}`] + offset
  )
  loginPage.logout();
}

export {
  prepareNotificationsCount,
  checkNotifications
}
