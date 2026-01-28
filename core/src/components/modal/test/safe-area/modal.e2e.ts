import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test, Viewports } from '@utils/test/playwright';

/**
 * Safe-area tests verify that modals correctly handle safe-area insets
 * based on modal type and screen size.
 *
 * These tests use simulated safe-area values (34px bottom) set in index.html.
 * They verify the modal wrapper has correct padding applied.
 */

// Helper to get the modal wrapper's computed padding-bottom
async function getWrapperPaddingBottom(page: E2EPage): Promise<string> {
  const modal = page.locator('ion-modal');
  return modal.evaluate((el: HTMLIonModalElement) => {
    const wrapper = el.shadowRoot?.querySelector('.modal-wrapper');
    if (!wrapper) return '0px';
    return getComputedStyle(wrapper).paddingBottom;
  });
}

// Helper to check if modal has a footer
async function modalHasFooter(page: E2EPage): Promise<boolean> {
  const modal = page.locator('ion-modal');
  return modal.evaluate((el: HTMLIonModalElement) => {
    return el.querySelector('ion-footer') !== null;
  });
}

// Phone viewport (less than 768px width)
const PhoneViewport = { width: 390, height: 844 };

// =============================================================================
// Phone Tests - Fullscreen modals need wrapper padding when no footer
// =============================================================================

configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: safe-area - phone'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(PhoneViewport);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('fullscreen modal without footer should have wrapper padding', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-no-footer');
      await ionModalDidPresent.next();

      const hasFooter = await modalHasFooter(page);
      expect(hasFooter).toBe(false);

      const paddingBottom = await getWrapperPaddingBottom(page);
      // Should have safe-area padding (34px as set in test HTML)
      expect(paddingBottom).toBe('34px');
    });

    test('fullscreen modal with footer should not have wrapper padding', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const hasFooter = await modalHasFooter(page);
      expect(hasFooter).toBe(true);

      const paddingBottom = await getWrapperPaddingBottom(page);
      // Footer handles safe-area, wrapper should have no padding
      expect(paddingBottom).toBe('0px');
    });

    test('default modal without footer should have wrapper padding on phone', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#default-no-footer');
      await ionModalDidPresent.next();

      // On phones, default modals are fullscreen
      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('34px');
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: safe-area - card modal on phone'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(PhoneViewport);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('card modal without footer should have wrapper padding on phone', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-modal-no-footer');
      await ionModalDidPresent.next();

      // Card modals on phones still extend to bottom edge
      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('34px');
    });

    test('card modal with footer should not have wrapper padding', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-modal');
      await ionModalDidPresent.next();

      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('0px');
    });
  });
});

// =============================================================================
// Tablet Tests - Centered dialogs don't need safe-area, fullscreen does
// =============================================================================

configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: safe-area - tablet'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('default modal should not have wrapper padding on tablet', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#default-modal');
      await ionModalDidPresent.next();

      // Centered dialog on tablet - inset from edges, no padding needed
      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('0px');
    });

    test('fullscreen modal without footer should have wrapper padding on tablet', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-no-footer');
      await ionModalDidPresent.next();

      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('34px');
    });

    test('fullscreen modal with footer should not have wrapper padding', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('0px');
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: safe-area - card modal on tablet'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('card modal should not have wrapper padding on tablet', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-modal');
      await ionModalDidPresent.next();

      // Card modals on tablets are inset from all edges
      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('0px');
    });
  });
});

// =============================================================================
// Sheet Modal Tests - Always touch bottom edge
// =============================================================================

configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: safe-area - sheet modal'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('sheet modal should not have wrapper padding (footer handles safe-area)', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://outsystemsrd.atlassian.net/browse/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal-full');
      await ionModalDidPresent.next();

      // Sheet modals with footer - footer handles the safe area
      const paddingBottom = await getWrapperPaddingBottom(page);
      expect(paddingBottom).toBe('0px');
    });
  });
});
