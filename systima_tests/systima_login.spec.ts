import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/page/LoginPage';
import { urls } from '../data/urlData';
import { credentials } from '../data/loginData';
import { loginPageErrors } from '../data/errorMessages';
import { DashboardPage } from '../src/page/DashboardPage';
import { PurchasePage } from '../src/page/PurchasePage';
import { ContactPage } from '../src/page/ContactPage';
import { dashboardLabels, purchaseLabels, contactLabels } from '../data/labels';
import { cssData } from '../data/cssData';


test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    //Go to login form
    await page.goto(urls.loginPage);
  });

  test('Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashBoardPage = new DashboardPage(page);
    await expect(page).toHaveURL(urls.loginPage);
    await loginPage.login(credentials.correctLogin, credentials.correctPassword);
    // check redirect to dashboard page and correct user name
    await expect(page).toHaveURL(urls.dashboard, { timeout: 10000 });
    await expect(page.locator(dashBoardPage.getPageElementSelector('usernameText'))).toBeVisible();
    await expect(page.locator(dashBoardPage.getPageElementSelector('usernameText'))).toContainText(credentials.userName);
  });

  test('Failed login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(page).toHaveURL(urls.loginPage);
    await loginPage.login(credentials.wrongLogin, credentials.wrongPassword);
    // checr red error message
    await expect(page.locator(loginPage.getPageElementSelector('errorAlert'))).toBeVisible();
    await expect(page.locator(loginPage.getPageElementSelector('errorAlert'))).toContainText(loginPageErrors.incorrectCreds);
  });
});

test.describe('Features Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    //Go to login form
    await page.goto(urls.loginPage);
    await expect(page).toHaveURL(urls.loginPage);
    await loginPage.login(credentials.correctLogin, credentials.correctPassword);
    // 10 seconds timeout need because sometimes dashboard page loads more than "standard" 5 seconds
    await expect(page).toHaveURL(urls.dashboard, { timeout: 10000 });
  });

  test('Create Purchase', async ({ page }) => {
    const dashBoardPage = new DashboardPage(page);
    const purchasePage = new PurchasePage(page);

    await dashBoardPage.openPurchasePage();
    await expect(page).toHaveURL(urls.purchase);
    await purchasePage.selectContact(purchaseLabels.systimaAs);
    await purchasePage.setTotalAmount('100');
    await purchasePage.selectFakturaDate('jan', '1');
    await purchasePage.selectForfallsDate('jan', '15');
    await purchasePage.selectAccount(purchaseLabels.accountItem);
    await page.getByRole('button', { name: purchaseLabels.bokfor, exact: true }).click();
    //Green success message should be visible
    await expect(page.locator(purchasePage.getPageElementSelector('statusMessage'))).toBeVisible();
    await expect(page.locator(purchasePage.getPageElementSelector('statusMessage'))).toHaveCSS('background-color', cssData.greenSuccess);
    await expect(page.locator(purchasePage.getPageElementSelector('statusMessage'))).toContainText(purchaseLabels.successPurchase);
    //Forms should be cleared
    await expect(page.getByLabel(purchaseLabels.fakturoDato)).toBeEmpty();
    await expect(page.getByLabel(purchaseLabels.forfallDato)).toBeEmpty();
    await expect(page.getByLabel(purchaseLabels.totalAmount)).toBeEmpty();
    await expect(page.getByLabel(purchaseLabels.contactLabel)).toBeEmpty();
    await expect(page.getByRole('textbox', { name: purchaseLabels.accountName })).toBeEmpty();
  });

  test('Duplicate Invoice Number Handling', async ({ page }) => {
    const dashBoardPage = new DashboardPage(page);
    const purchasePage = new PurchasePage(page);

    await dashBoardPage.openPurchasePage();
    await expect(page).toHaveURL(urls.purchase);
    await purchasePage.selectContact(purchaseLabels.systimaAs);
    await purchasePage.setTotalAmount('100');
    await purchasePage.selectFakturaDate('jan', '1');
    await purchasePage.selectForfallsDate('jan', '15');
    await purchasePage.selectAccount(purchaseLabels.accountItem);
    await purchasePage.setInvoiceNumber('1');
    await page.getByRole('button', { name: purchaseLabels.bokfor, exact: true }).click();
    //Red warning message should be visible
    await expect(page.locator(purchasePage.getPageElementSelector('accountErrorMessage'))).toHaveCSS('color', cssData.redErrorText);
    await expect(page.locator(purchasePage.getPageElementSelector('accountErrorMessage'))).toContainText(purchaseLabels.duplicatedInvoice);
    //Forms should be not cleared
    await expect(page.getByLabel(purchaseLabels.fakturoDato)).toHaveValue('01.01.2024');
    await expect(page.getByLabel(purchaseLabels.forfallDato)).toHaveValue('15.01.2024');
    await expect(page.getByLabel(purchaseLabels.totalAmount)).toHaveValue('100');
    await expect(page.getByRole('button', { name: purchaseLabels.contactLabel })).toContainText(purchaseLabels.systimaAs);
    await expect(page.getByRole('button', { name: purchaseLabels.accountName })).toContainText(purchaseLabels.accountItem);
  });

  test('Contact Creation - Validation', async ({ page }) => {
    const dashBoardPage = new DashboardPage(page);
    const contactPage = new ContactPage(page);

    await dashBoardPage.openContactPage();
    await contactPage.openNewContactModal();
    await contactPage.submitModal();
    //check red error warning
    await expect(page.getByText(contactLabels.emptyContactMessage)).toHaveCSS('color', cssData.redErrorText);
    await expect(page.getByText(contactLabels.emptyContactMessage)).toContainText(contactLabels.emptyContactMessage);
  });

  test('Contact Creation - Success', async ({ page }) => {
    const dashBoardPage = new DashboardPage(page);
    const contactPage = new ContactPage(page);

    await dashBoardPage.openContactPage();
    await contactPage.openNewContactModal();
    let testName = 'Test';
    await contactPage.setContactName(testName);
    await contactPage.submitModal();
    //check green success contact create message
    await expect(page.locator(contactPage.getPageElementSelector('successContact'))).toHaveCSS('background-color', cssData.greenSuccess);
    await expect(page.locator(contactPage.getPageElementSelector('successContact'))).toContainText(contactLabels.successContactMessage);
    // check new contact row 
    // important! first() added because we have many contacts with same nameon ou test environment.
    // In "real" tests we must use autogenerated random strings instead "Test"! 
    // also will be good delete test contacts after test run
    let testRowSelector = contactPage.prepareTestRowSelector(testName);
    await page.locator(testRowSelector).first().scrollIntoViewIfNeeded();
    await expect(page.locator(testRowSelector).first()).toBeVisible();
  });

});