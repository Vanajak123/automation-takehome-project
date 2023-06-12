// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://amazon.com');
  const serachBar = await page.getByLabel('Search Amazon');
  serachBar.fill('tv');
  const searchButton= await page.locator('css=[value="Go"]');
  await searchButton.click();
  await page.waitForLoadState('domcontentloaded');
  const drop = await page.locator('#a-autoid-0-announce');
  await drop.click();
  await  page.waitForSelector('css=[id="s-result-sort-select_1"]')
  const sortBy = page.locator('css=[id="s-result-sort-select_1"]');
  await sortBy.click();
  await page.waitForTimeout(5000);
  
});
