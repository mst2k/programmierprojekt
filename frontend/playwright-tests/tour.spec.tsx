import { expect, test } from "@playwright/experimental-ct-react";

test('Take the tour and end up at the editor', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Los geht\'s' }).click();
    await page.getByText('Willkommen auf unserer').click();
    await page.locator('[data-test-id="button-primary"]').click();
    await page.getByText('Erkunde unsere').click();
    await page.locator('[data-test-id="button-primary"]').click();
    await page.getByText('Lerne mehr über dieses').click();
    await page.locator('[data-test-id="button-primary"]').click();
    await page.getByText('Bereit, loszulegen? Klicke').click();
    await page.locator('[data-test-id="button-primary"]').click();
    await page.locator('#root div').filter({ hasText: 'GMPLNativ LPNativ MPSUmwandlung 1Zielfunktion: Restriktionen: Nicht-Negativitä' }).nth(3).click();
  });