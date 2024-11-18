import { BasePage } from './abstracion/BasePage';
import { dashboardLabels } from '../../data/labels';

/**
 * Dashboard page with all required selectors and functions
 */
export class DashboardPage extends BasePage {

    private readonly usernameText: string = '.text-16';
    
    /**
     * Open purchase page from nav bar
     */
    async openPurchasePage() {
        await this.page.getByRole('button', { name: 'Bokføring', exact: true }).click();
        await this.page.getByRole('link', { name: 'Bokfør andre filer' }).click();
    }

    /**
     * Open contact page from nav bar
     */
    async openContactPage() {
        await this.page.getByRole('link', { name: dashboardLabels.contaktPage }).click();
    }

}
