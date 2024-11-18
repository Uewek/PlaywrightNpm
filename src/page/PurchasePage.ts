import { BasePage } from './abstracion/BasePage';
import { purchaseLabels } from '../../data/labels';

/**
 * Purchase page with all required selectors and functions
 */
export class PurchasePage extends BasePage {

    private readonly contactInput: string = '#input-135';
    private readonly expandedContactInput: string = '#input-293';
    private readonly amountInput: string = '#input-148';
    private readonly fakturaDateInput: string = '#input-159';
    private readonly forfallsDateInput = '#input-163';
    private readonly accountInput: string = '#input-180';
    private readonly systimaListItem: string = '#list-item-291-2';
    private readonly faktureCurrentMonth: string = '[class="accent--text"]';
    private readonly singleItemOfSelect: string = 'div[role="option"] >> text=';
    private readonly statusMessage: string = '.v-snack__wrapper';
    private readonly accountErrorMessage: string = '[role="alert"]'

    /**
     * Select given contact
     * @param contact 
     */
    async selectContact(contact: string) {
        await this.page.getByLabel(purchaseLabels.contactLabel).click();
        await this.page.getByLabel(purchaseLabels.sok).click();
        await this.page.getByLabel(purchaseLabels.sok).fill('systima');
        await this.page.locator(this.singleItemOfSelect + contact).click();
    }

    /**
     * Set total amount
     * @param totalAmount 
     */
    async setTotalAmount(totalAmount: string) {
        await this.page.getByLabel(purchaseLabels.totalAmount).fill(totalAmount);
    }

    /**
     * Select fakture date
     * @param month 
     * @param day 
     */
    async selectFakturaDate(month: string, day: string) {
        await this.page.getByLabel(purchaseLabels.fakturoDato).click();
        await this.page.locator(this.faktureCurrentMonth).click();
        await this.page.getByRole('button', { name: month }).click();
        await this.page.getByRole('button', { name: day + '.' }).first().click();
    }

    /**
     * Select fofrall date 
     * @param month 
     * @param day 
     */
    async selectForfallsDate(month: string, day: string) {
        await this.page.getByLabel(purchaseLabels.forfallDato).click();
        await this.page.locator(this.faktureCurrentMonth).nth(1).click();
        await this.page.getByRole('button', { name: month }).nth(1).click();
        await this.page.getByRole('button', { name: day + '.' }).click();
    }

    /**
     * Select given account
     * @param account 
     */
    async selectAccount(account: string) {
        await this.page.getByRole('textbox', { name: 'Konto *' }).click();
        await this.page.locator('[id^="list-item-"]').filter({ hasText: account });
    }

    /**
     * Set given invoice number to invoice input
     * @param invoiceNumber 
     */
    async setInvoiceNumber(invoiceNumber: string) {
        await this.page.getByLabel(purchaseLabels.invoiceLabel).fill(invoiceNumber);
    }

}
