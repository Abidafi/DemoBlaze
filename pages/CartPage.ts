import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly rows: Locator;
  readonly placeOrderBtn: Locator;

  // Order modal
  readonly orderModal: Locator;
  readonly nameField: Locator;
  readonly countryField: Locator;
  readonly cityField: Locator;
  readonly cardField: Locator;
  readonly monthField: Locator;
  readonly yearField: Locator;
  readonly purchaseBtn: Locator;

  // SweetAlert confirmation
  readonly confirmation: Locator;
  readonly confirmationOk: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('#tbodyid tr');
    this.placeOrderBtn = page.locator('button:has-text("Place Order")');

    this.orderModal   = page.locator('#orderModal');
    this.nameField    = page.locator('#name');
    this.countryField = page.locator('#country');
    this.cityField    = page.locator('#city');
    this.cardField    = page.locator('#card');
    this.monthField   = page.locator('#month');
    this.yearField    = page.locator('#year');
    this.purchaseBtn  = page.locator('#orderModal button:has-text("Purchase")');

    this.confirmation   = page.locator('.sweet-alert');
    this.confirmationOk = page.locator('.sweet-alert button.confirm');
  }

  /** Navigate to cart and wait for cart rows to be present */
  async goto(): Promise<void> {
    await this.page.locator('#cartur').click();
    await this.page.waitForURL('**/cart.html');
  }

  /** Fill and submit the order form */
  async placeOrder(details: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }): Promise<void> {
    await this.placeOrderBtn.click();
    await this.orderModal.waitFor({ state: 'visible' });

    await this.nameField.fill(details.name);
    await this.countryField.fill(details.country);
    await this.cityField.fill(details.city);
    await this.cardField.fill(details.card);
    await this.monthField.fill(details.month);
    await this.yearField.fill(details.year);

    await this.purchaseBtn.click();
  }

  /** Dismiss the SweetAlert confirmation dialog */
  async dismissConfirmation(): Promise<void> {
    await this.confirmation.waitFor({ state: 'visible', timeout: 15_000 });
    await this.confirmationOk.click();
  }
}