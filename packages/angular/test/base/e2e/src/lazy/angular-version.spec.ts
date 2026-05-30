import { test, expect } from '@playwright/test';
import { VERSION } from '@angular/core';

test('should be on the correct Angular version', async ({ page }) => {
  await page.goto('/lazy');

  // Get the major version from Angular core
  const angularMajorVersion = VERSION.major;

  await expect(page.locator('ion-title')).toContainText(`Angular ${angularMajorVersion}`);
});
