import { expect, Page, Locator } from '@playwright/test';

/**
 * Base class for all pages
 */
export abstract class BasePage {

    protected readonly page: Page;

    /**
     * Constructor of all pages
     * @param page 
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get page element selector by page element name
     * 
     * @param selector 
     * @returns 
     */
    getPageElementSelector(selector: string) {
        if (selector in this) {
            return (this as any)[selector];
        }
        return null;
    }
}