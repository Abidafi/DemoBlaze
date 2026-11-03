import { test, expect, Dialog } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('DemoBlaze - End-to-end purchase flow (POM)', () => {
  const username = `testuser_${Date.now()}`;
  const password = 'TestPass123!';

  test('sign up, add laptop, log in, complete purchase', async ({ page }) => {
    page.on('dialog', async (dialog: Dialog) => {
      await dialog.accept();
    });

    const home    = new HomePage(page);
    const product = new ProductPage(page);
    const cart    = new CartPage(page);

    // ---------- Step 1: Sign up ----------
    await home.goto();
    await expect(page).toHaveTitle(/STORE/);

    const signupDialog = await home.signup(username, password);
    expect(signupDialog.message()).toContain('Sign up successful');

    // ---------- Step 2: Log in ----------
    await home.login(username, password);
    await expect(home.loggedInUser).toContainText(username, { timeout: 15_000 });

    // ---------- Step 3: Add a laptop ----------
    await home.goToLaptops();

    const names = await home.productNames();
    expect(names.length).toBeGreaterThan(0);
    const firstLaptopName = names[0];

    await home.openProduct(0);
    const addDialog = await product.addToCart();
    expect(addDialog.message()).toContain('Product added');

    // ---------- Step 4: Checkout ----------
    await cart.goto();
    await expect(cart.rows).toHaveCount(1);
    await expect(cart.rows.first()).toContainText(firstLaptopName);

    await cart.placeOrder({
      name: 'Test User',
      country: 'United States',
      city: 'New York',
      card: '1234567890123456',
      month: '12',
      year: '2025',
    });

    // ---------- Step 5: Verify confirmation ----------
    await expect(cart.confirmation).toContainText(
      'Thank you for your purchase!',
      { timeout: 15_000 },
    );

    await cart.dismissConfirmation();
    await expect(cart.confirmation).toBeHidden();
  });
});