import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Safe-area tests verify that ion-content correctly applies safe-area classes
 * based on the presence/absence of sibling ion-header and ion-footer elements.
 *
 * These tests verify the FW-6830 feature: automatic safe-area handling for content.
 */

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('content: safe-area'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/content/test/safe-area', config);
    });

    test('content without header should have safe-area-top class', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-no-header');
      await expect(content).toHaveClass(/safe-area-top/);
      await expect(content).not.toHaveClass(/safe-area-bottom/);
    });

    test('content without footer should have safe-area-bottom class', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-no-footer');
      await expect(content).not.toHaveClass(/safe-area-top/);
      await expect(content).toHaveClass(/safe-area-bottom/);
    });

    test('content with both header and footer should not have safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-with-both');
      await expect(content).not.toHaveClass(/safe-area-top/);
      await expect(content).not.toHaveClass(/safe-area-bottom/);
    });

    test('content without header or footer should have both safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-no-both');
      await expect(content).toHaveClass(/safe-area-top/);
      await expect(content).toHaveClass(/safe-area-bottom/);
    });

    test('content with wrapped header should not have safe-area-top class', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-wrapped-header');
      // Wrapped header detection should find the ion-header inside my-header
      await expect(content).not.toHaveClass(/safe-area-top/);
    });

    test('content with wrapped footer should not have safe-area-bottom class', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-wrapped-footer');
      // Wrapped footer detection should find the ion-footer inside my-footer
      await expect(content).not.toHaveClass(/safe-area-bottom/);
    });

    test('nested content should not have safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const nestedContent = page.locator('#content-nested');
      // Nested content should not be treated as main content
      await expect(nestedContent).not.toHaveClass(/safe-area-top/);
      await expect(nestedContent).not.toHaveClass(/safe-area-bottom/);
    });

    test('outer content should still have safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const outerContent = page.locator('#content-outer');
      // Outer content has no sibling header/footer, so it should have safe-area classes
      await expect(outerContent).toHaveClass(/safe-area-top/);
      await expect(outerContent).toHaveClass(/safe-area-bottom/);
    });

    test('content inside modal should not have safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      // Set up event spy BEFORE opening modal
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      // Open the modal
      await page.evaluate(() => {
        const modal = document.getElementById('test-modal') as HTMLIonModalElement;
        modal.isOpen = true;
      });

      // Wait for modal to be presented
      await ionModalDidPresent.next();

      const modalContent = page.locator('#content-in-modal');
      // Content inside modal should not be treated as main content
      await expect(modalContent).not.toHaveClass(/safe-area-top/);
      await expect(modalContent).not.toHaveClass(/safe-area-bottom/);
    });

    test('dynamic header addition should update safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-dynamic');

      // Initially should have safe-area-top (no header)
      await expect(content).toHaveClass(/safe-area-top/);

      // Add header dynamically (use evaluate to avoid pointer-events issues in Firefox)
      await page.evaluate(() => (window as any).addHeader());

      // Wait for mutation observer to trigger and component to update
      await expect(content).not.toHaveClass(/safe-area-top/, { timeout: 1000 });
    });

    test('dynamic header removal should update safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-dynamic');

      // Add header first (use evaluate to avoid pointer-events issues in Firefox)
      await page.evaluate(() => (window as any).addHeader());
      await expect(content).not.toHaveClass(/safe-area-top/, { timeout: 1000 });

      // Remove header
      await page.evaluate(() => (window as any).removeHeader());

      // Should have safe-area-top again
      await expect(content).toHaveClass(/safe-area-top/, { timeout: 1000 });
    });
  });
});
