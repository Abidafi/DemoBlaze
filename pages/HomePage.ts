import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  // Header / nav
  readonly signupLink: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly loggedInUser: Locator;
  readonly laptopsCategory: Locator;

  // Sign up modal
  readonly signupModal: Locator;
  readonly signupUsername: Locator;
  readonly signupPassword: Locator;
  readonly signupSubmit: Locator;

  // Log in modal
  readonly loginModal: Locator;
  readonly loginUsername: Locator;
  readonly loginPassword: Locator;
  readonly loginSubmit: Locator;

  // Product listing
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signupLink  = page.locator('#signin2');
    this.loginLink   = page.locator('#login2');
    this.cartLink    = page.locator('#cartur');
    this.loggedInUser = page.locator('#nameofuser');
    this.laptopsCategory = page.locator('a.list-group-item:has-text("Laptops")');

    this.signupModal    = page.locator('#signInModal');
    this.signupUsername = page.locator('#sign-username');
    this.signupPassword = page.locator('#sign-password');
    this.signupSubmit   = page.locator('#signInModal button:has-text("Sign up")');

    this.loginModal    = page.locator('#logInModal');
    this.loginUsername = page.locator('#loginusername');
    this.loginPassword = page.locator('#loginpassword');
    this.loginSubmit   = page.locator('#logInModal button:has-text("Log in")');

    this.productCards = page.locator('.card-title a');
  }

  /** Navigate to the store homepage */
  async goto(): Promise<void> {
    await this.page.goto('/index.html');
  }

  /** Open the Sign up modal */
  async openSignup(): Promise<void> {
    await this.signupLink.click();
    await this.signupModal.waitFor({ state: 'visible' });
  }

  /**
   * Fill + submit signup form.
   * Returns the signup dialog so the test can assert the message.
   */
  async signup(user: string, pass: string) {
    await this.openSignup();
    await this.signupUsername.fill(user);
    await this.signupPassword.fill(pass);

    const dialogPromise = this.page.waitForEvent('dialog');
    await this.signupSubmit.click();
    return dialogPromise;
  }

  /** Open the Log in modal */
  async openLogin(): Promise<void> {
    await this.loginLink.click();
    await this.loginModal.waitFor({ state: 'visible' });
  }

  /** Log in with the given credentials */
  async login(user: string, pass: string): Promise<void> {
    await this.openLogin();
    await this.loginUsername.fill(user);
    await this.loginPassword.fill(pass);
    await this.loginSubmit.click();
  }

  /** Navigate to the Laptops category and wait for products to render */
  async goToLaptops(): Promise<void> {
    await this.laptopsCategory.click();
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  /** Click the product at the given index (defaults to first) */
  async openProduct(index = 0): Promise<void> {
    await this.productCards.nth(index).click();
  }

  /** Returns the visible product names on the current listing */
  async productNames(): Promise<string[]> {
    return (await this.productCards.allInnerTexts()).map(n => n.trim());
  }
}