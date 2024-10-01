import { expect, test } from "@playwright/experimental-ct-react";
import { gmplStringTransport } from "../src/interfaces/TestData";

test('Open solver page and solve transportation problem', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Löser' }).click();
  await page.getByRole('tab', { name: 'GMPL Nativ' }).click();
  await page.locator('.view-lines').click();
  await page.keyboard.insertText(gmplStringTransport);
  await page.getByRole('button', { name: 'Lösen' }).click();
  await expect(page.locator('#root')).toContainText('Zielfunktionswert: 153.675');
});


