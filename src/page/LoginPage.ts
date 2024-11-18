import { expect, Page, Locator } from '@playwright/test';
import { urls } from '../../data/urlData';
import { BasePage } from './abstracion/BasePage';

/**
 * Login page 
 */
export class LoginPage extends BasePage {
    private readonly usernameInput: string = '#input-12';
    private readonly passwordInput: string = '#input-15';
    private readonly loginButton: string = '[type="submit"]';
    private readonly errorAlert: string = '[role="alert"]';


    /**
     * open login page
     */
    async navigateToLoginForm() {
        await this.page.goto(urls.loginPage);
    }

    /**
     * Login by given credentials
     * @param username 
     * @param password 
     */
    async login(username: string, password: string) {
        await expect(this.page.locator(this.usernameInput)).toBeVisible();
        await this.page.fill(this.usernameInput, username);
        await expect(this.page.locator(this.passwordInput)).toBeVisible();
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }

}
