import { expect, test } from "@playwright/experimental-ct-react";
import { lpString } from "../src/interfaces/TestData";

test('Open converter page and convert lp to gmpl', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Konvertierer' }).click();
    await page.getByPlaceholder('Geben Sie hier Ihren Code ein').click();
    await page.keyboard.insertText(lpString);
    await page.getByPlaceholder('Geben Sie hier Ihren Code ein').fill('Maximize\n obj: x1 + 2 x2 + 3 x3 + x4\nSubject To\n c1: - x1 + x2 + x3 + 10 x4 <= 20\n c2: x1 - 3 x2 + x3 <= 30\n c3: x2 - 3.5 x4 = 0\nBounds\n 0 <= x1 <= 40\n 2 <= x4 <= 3\nEnd');
    await page.locator('button').filter({ hasText: 'Von' }).click();
    await page.getByLabel('lp', { exact: true }).click();
    await page.locator('button').filter({ hasText: 'Nach' }).click();
    await page.getByLabel('gmpl', { exact: true }).click();
    await page.getByRole('button', { name: 'Ausführen' }).click();
    await page.getByText('/* Declaration of decision').click();
  });