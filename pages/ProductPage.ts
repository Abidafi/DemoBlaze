import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartBtn: Locator;
  readonly productTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartBtn = page.locator('a.btn-success:has-text("Add to cart")');
    this.productTitle = page.locator('.name');
  }

  /** Click "Add to cart" and return the resulting alert dialog */
  async addToCart() {
    await this.addToCartBtn.waitFor({ state: 'visible' });
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.addToCartBtn.click();
    return dialogPromise;
  }
}