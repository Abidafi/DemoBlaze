import { test, expect, Page, Dialog } from '@playwright/test';

test.describe('DemoBlaze - End-to-end purchase flow', () => {
  const username: string = `testuser_${Date.now()}`;
  const password: string = 'TestPass123!';

  test('sign up, add laptop, log in, and complete purchase', async ({ page }: { page: Page }) => {
    // Catch-all listener: automatically clicks "OK" on ANY dialog
    page.on('dialog', async (dialog: Dialog) => {
      await dialog.accept();
    });

    // ---------- Step 1: Sign up ----------
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/STORE/);

    await page.locator('#signin2').click();
    await page.locator('#signInModal').waitFor({ state: 'visible' });

    await page.locator('#sign-username').fill(username);
    await page.locator('#sign-password').fill(password);

    const signupAlert = page.waitForEvent('dialog');
    await page.locator('#signInModal button:has-text("Sign up")').click();
    const signupDialog = await signupAlert;
    expect(signupDialog.message()).toContain('Sign up successful');

    // ---------- Step 2: Log in ----------
    // We log in FIRST so the session is active before we add items to the cart
    await page.locator('#login2').click();
    await page.locator('#logInModal').waitFor({ state: 'visible' });

    await page.locator('#loginusername').fill(username);
    await page.locator('#loginpassword').fill(password);
    await page.locator('#logInModal button:has-text("Log in")').click();

    await expect(page.locator('#nameofuser')).toContainText(username, { timeout: 15_000 });

    // ---------- Step 3: Add a laptop to the cart ----------
    await page.locator('a.list-group-item:has-text("Laptops")').click();
    await page.locator('.card-title a').first().waitFor({ state: 'visible' });

    const firstLaptopName: string = (await page.locator('.card-title a').first().innerText()).trim();
    expect(firstLaptopName.length).toBeGreaterThan(0);

    await page.locator('.card-title a').first().click();
    await page.locator('a.btn-success:has-text("Add to cart")').waitFor({ state: 'visible' });

    const addToCartAlert = page.waitForEvent('dialog');
    await page.locator('a.btn-success:has-text("Add to cart")').click();
    const addToCartDialog = await addToCartAlert;
    expect(addToCartDialog.message()).toContain('Product added');

    // ---------- Step 4: Checkout ----------
    await page.locator('#cartur').click();
    await page.waitForURL('**/cart.html');

    const cartRows = page.locator('#tbodyid tr');
    await expect(cartRows).toHaveCount(1);
    await expect(cartRows.first()).toContainText(firstLaptopName);

    await page.locator('button:has-text("Place Order")').click();
    await page.locator('#orderModal').waitFor({ state: 'visible' });

    await page.locator('#name').fill('Test User');
    await page.locator('#country').fill('United States');
    await page.locator('#city').fill('New York');
    await page.locator('#card').fill('1234567890123456');
    await page.locator('#month').fill('12');
    await page.locator('#year').fill('2025');

    await page.locator('#orderModal button:has-text("Purchase")').click();

    // ---------- Verify purchase confirmation ----------
    const confirmation = page.locator('.sweet-alert');
    await confirmation.waitFor({ state: 'visible', timeout: 15_000 });
    await expect(confirmation).toContainText('Thank you for your purchase!');

    await page.locator('.sweet-alert button.confirm').click();
    await expect(confirmation).toBeHidden();
  });
});