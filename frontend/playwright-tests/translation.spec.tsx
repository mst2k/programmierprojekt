import { expect, test } from "@playwright/experimental-ct-react";

test('Check translations', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.locator('#root')).toContainText('Los geht\'s');
    await page.getByRole('button', { name: 'Sprache' }).click();
    await page.getByText('EnglischÄndert die').click();
    await expect(page.locator('#root')).toContainText('Get Started');
  });