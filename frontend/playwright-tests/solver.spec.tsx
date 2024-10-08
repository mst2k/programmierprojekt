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

test('Open shareable link and assert values, solve and check result', async ({ page }) => {
  await page.goto('http://localhost:5173//#/solver?param=H4sIAAAAAAAACn2NQQ7CIBBFT0PXSiWsWNj2AF5hhLEShTbDdOHtBTW4MLiZ%2BcnL%2B3%2B9Q%2BRkhBqEHoSUEQLmJ%2FpjvlCSHPO1sIL1%2FKhIlaSnQn%2B9c9vb7z6imroAdMPmuK0lDgNEV4H%2BN%2B1a1uG763xiiBbfy6p09FWTJalXe4Pkhguhn688LomN7OxGhJFPMKNhgpjWhfgJdkMqmFkBAAA%3D');
  await expect(page.getByPlaceholder('Werksname').first()).toHaveValue('a');
  await expect(page.getByPlaceholder('Kapazität').first()).toHaveValue('5');
  await expect(page.getByPlaceholder('Werksname').nth(1)).toHaveValue('b');
  await expect(page.getByPlaceholder('Kapazität').nth(1)).toHaveValue('10');
  await expect(page.getByPlaceholder('Marktname').first()).toHaveValue('c');
  await expect(page.getByPlaceholder('Nachfrage').first()).toHaveValue('7');
  await expect(page.getByPlaceholder('Marktname').nth(1)).toHaveValue('d');
  await expect(page.getByPlaceholder('Nachfrage').nth(1)).toHaveValue('4');
  await expect(page.getByPlaceholder('Entfernungen').first()).toHaveValue('3');
  await expect(page.getByPlaceholder('Entfernungen').nth(1)).toHaveValue('2');
  await expect(page.getByPlaceholder('Entfernungen').nth(2)).toHaveValue('3');
  await expect(page.getByPlaceholder('Entfernungen').nth(3)).toHaveValue('2');
  await expect(page.getByPlaceholder('Frachtkosten (Pro Einheit und')).toHaveValue('2');
  await page.getByRole('button', { name: 'Lösen' }).click();
  await expect(page.locator('#root')).toContainText('Zielfunktionswert: 0.057999999999999996');
});