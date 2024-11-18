import { BasePage } from './abstracion/BasePage';
import { contactLabels } from '../../data/labels';

/**
 * Contact page with all required selectors and functions
 */
export class ContactPage extends BasePage {

    private readonly newContactButton = '#contacts-create-contact-button';
    private readonly emptyFormModalMessage = '.v-messages__message.message-transition-enter-to';
    private readonly successContact = '.v-snack__wrapper.v-sheet.theme--dark.success';

    /**
     * Open new contact modal form
     */
    async openNewContactModal() {
        await this.page.locator(this.newContactButton).click();
    }

    /**
     * Submit new contact modal
     */
    async submitModal() {
        await this.page.getByRole('button', { name: contactLabels.submitNewContact }).scrollIntoViewIfNeeded();
        await this.page.getByRole('button', { name: contactLabels.submitNewContact }).click();
    }

    /**
     * Set given name to contact input
     * @param name 
     */
    async setContactName(name: string) {
        await this.page.getByLabel(contactLabels.nameFieldLabel).fill(name);
    }

    /**
     * Prepare dynamic selector for contact row
     * @param contactName 
     * @returns 
     */
    prepareTestRowSelector(contactName: string): string {
        return 'tr:has-text("' + contactName + '")';
    }
}
