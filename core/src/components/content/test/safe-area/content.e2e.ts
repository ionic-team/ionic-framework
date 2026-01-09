import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Safe-area tests verify that ion-content correctly applies safe-area classes
 * based on the presence/absence of sibling ion-header and ion-footer elements.
 *
 * Safe-area class logic:
 * - safe-area-top: main content without header
 * - safe-area-bottom: main content without footer/tab-bar
 * - safe-area-left: always on main content (for landscape notched devices)
 * - safe-area-right: always on main content (for landscape notched devices)
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
      // Left/right always apply to main content
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('content without footer should have safe-area-bottom class', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-no-footer');
      await expect(content).not.toHaveClass(/safe-area-top/);
      await expect(content).toHaveClass(/safe-area-bottom/);
      // Left/right always apply to main content
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('content with both header and footer should not have top/bottom safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-with-both');
      await expect(content).not.toHaveClass(/safe-area-top/);
      await expect(content).not.toHaveClass(/safe-area-bottom/);
      // Left/right still apply to main content even with header/footer
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('content without header or footer should have all safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-no-both');
      await expect(content).toHaveClass(/safe-area-top/);
      await expect(content).toHaveClass(/safe-area-bottom/);
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('content with wrapped header should not have safe-area-top class', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-wrapped-header');
      // Wrapped header detection should find the ion-header inside my-header
      await expect(content).not.toHaveClass(/safe-area-top/);
      // Left/right still apply to main content
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('content with wrapped footer should not have safe-area-bottom class', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-wrapped-footer');
      // Wrapped footer detection should find the ion-footer inside my-footer
      await expect(content).not.toHaveClass(/safe-area-bottom/);
      // Left/right still apply to main content
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('nested content should not have any safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const nestedContent = page.locator('#content-nested');
      // Nested content should not be treated as main content - no safe-area classes at all
      await expect(nestedContent).not.toHaveClass(/safe-area-top/);
      await expect(nestedContent).not.toHaveClass(/safe-area-bottom/);
      await expect(nestedContent).not.toHaveClass(/safe-area-left/);
      await expect(nestedContent).not.toHaveClass(/safe-area-right/);
    });

    test('outer content should have all safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const outerContent = page.locator('#content-outer');
      // Outer content has no sibling header/footer, so it should have all safe-area classes
      await expect(outerContent).toHaveClass(/safe-area-top/);
      await expect(outerContent).toHaveClass(/safe-area-bottom/);
      await expect(outerContent).toHaveClass(/safe-area-left/);
      await expect(outerContent).toHaveClass(/safe-area-right/);
    });

    test('content inside modal should not have any safe-area classes', async ({ page }, testInfo) => {
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
      // Content inside modal should not be treated as main content - no safe-area classes at all
      await expect(modalContent).not.toHaveClass(/safe-area-top/);
      await expect(modalContent).not.toHaveClass(/safe-area-bottom/);
      await expect(modalContent).not.toHaveClass(/safe-area-left/);
      await expect(modalContent).not.toHaveClass(/safe-area-right/);
    });

    test('dynamic header addition should update safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const content = page.locator('#content-dynamic');

      // Initially should have safe-area-top (no header) and left/right (always on main content)
      await expect(content).toHaveClass(/safe-area-top/);
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);

      // Add header dynamically (use evaluate to avoid pointer-events issues in Firefox)
      await page.evaluate(() => (window as any).addHeader());

      // Wait for mutation observer to trigger and component to update
      await expect(content).not.toHaveClass(/safe-area-top/, { timeout: 1000 });
      // Left/right should remain
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
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
      // Left/right should remain throughout
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);

      // Remove header
      await page.evaluate(() => (window as any).removeHeader());

      // Should have safe-area-top again, left/right should remain
      await expect(content).toHaveClass(/safe-area-top/, { timeout: 1000 });
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('content inside ion-tabs with tab bar should not have safe-area-bottom', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const content = page.locator('#content-dynamic-tabs');
      // Tab bar is present, so content should not have safe-area-bottom
      await expect(content).not.toHaveClass(/safe-area-bottom/);
      // But left/right should still apply (main content)
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('dynamic tab bar removal should update safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const content = page.locator('#content-dynamic-tabs');

      // Initially tab bar is present, so no safe-area-bottom
      await expect(content).not.toHaveClass(/safe-area-bottom/);
      // Left/right should be present throughout
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);

      // Remove tab bar
      await page.evaluate(() => (window as any).removeTabBar());

      // Should have safe-area-bottom now, left/right remain
      await expect(content).toHaveClass(/safe-area-bottom/, { timeout: 1000 });
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });

    test('dynamic tab bar addition should update safe-area classes', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const content = page.locator('#content-dynamic-tabs');

      // Remove tab bar first
      await page.evaluate(() => (window as any).removeTabBar());
      await expect(content).toHaveClass(/safe-area-bottom/, { timeout: 1000 });
      // Left/right should be present throughout
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);

      // Add tab bar back
      await page.evaluate(() => (window as any).addTabBar());

      // Should not have safe-area-bottom anymore, left/right remain
      await expect(content).not.toHaveClass(/safe-area-bottom/, { timeout: 1000 });
      await expect(content).toHaveClass(/safe-area-left/);
      await expect(content).toHaveClass(/safe-area-right/);
    });
  });
});
