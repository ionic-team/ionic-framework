import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * `collapse="hide"` applies to all themes (ios, md, ionic) for `ion-header`.
 * Footer-side behavior is covered in `src/components/footer/test/hide/footer.e2e.ts`,
 * which drives this same demo page from the footer's perspective.
 *
 * The interaction (see `@utils/on-scroll/collapse-hide.utils`):
 *   - Hides after >= 24px cumulative downward scroll
 *   - Shows after >= 5px cumulative upward scroll
 *   - Opposing direction drains (not resets) the other accumulator,
 *     so inertial-scroll jitter doesn't stall either transition.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('header: collapse hide — behavior'), () => {
    test('should hide the header after cumulative downward scroll past threshold', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const header = page.locator('#demo-header');
      const content = page.locator('ion-content');

      await expect(header).not.toHaveClass(/header-collapse-hide-hidden/);

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 40, 0);
      });
      await page.locator('#demo-header.header-collapse-hide-hidden').waitFor();

      await expect(header).toHaveClass(/header-collapse-hide-hidden/);
    });

    test('should show the header again after cumulative upward scroll past threshold', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const header = page.locator('#demo-header');
      const content = page.locator('ion-content');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-header.header-collapse-hide-hidden').waitFor();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, -20, 0);
      });
      await page.waitForChanges();

      await expect(header).not.toHaveClass(/header-collapse-hide-hidden/);
    });

    test('should not hide the header below the cumulative downward threshold', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const header = page.locator('#demo-header');
      const content = page.locator('ion-content');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 10, 0);
      });
      await page.waitForChanges();

      await expect(header).not.toHaveClass(/header-collapse-hide-hidden/);
    });

    test('should set inert and aria-hidden on the header when it hides', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const header = page.locator('#demo-header');
      const content = page.locator('ion-content');

      expect(await header.getAttribute('inert')).toBeNull();
      expect(await header.getAttribute('aria-hidden')).toBeNull();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-header.header-collapse-hide-hidden').waitFor();

      await expect(header).toHaveAttribute('inert', '');
      await expect(header).toHaveAttribute('aria-hidden', 'true');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, -20, 0);
      });
      await page.waitForChanges();

      expect(await header.getAttribute('inert')).toBeNull();
      expect(await header.getAttribute('aria-hidden')).toBeNull();
    });

    test('should add the header partner class and slide CSS variable to ion-content', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const content = page.locator('ion-content');

      await expect(content).toHaveClass(/content-header-hide-scroll-partner/);

      // Slide distance is set at runtime by createCollapseHideInteraction
      // via readTask/writeTask, so poll until it lands on a positive value.
      await expect
        .poll(async () => content.evaluate((el: HTMLElement) => el.style.getPropertyValue('--header-hide-slide-y')))
        .toMatch(/^[1-9]\d*px$/);
    });

    test('should toggle the content-header-hide-scroll-hidden class together with the header', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const content = page.locator('ion-content');

      await expect(content).not.toHaveClass(/content-header-hide-scroll-hidden/);

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('ion-content.content-header-hide-scroll-hidden').waitFor();

      await expect(content).toHaveClass(/content-header-hide-scroll-hidden/);

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, -20, 0);
      });
      await page.waitForChanges();

      await expect(content).not.toHaveClass(/content-header-hide-scroll-hidden/);
    });

    test('should stop hiding when collapse is removed', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const header = page.locator('#demo-header');
      const content = page.locator('ion-content');

      // Remove the `collapse` attribute directly — `ion-toggle.checked = false`
      // does not fire `ionChange`, so we bypass the demo toggle.
      await header.evaluate((el: HTMLElement) => el.removeAttribute('collapse'));
      await page.waitForChanges();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.waitForChanges();

      await expect(header).not.toHaveClass(/header-collapse-hide-hidden/);
      await expect(content).not.toHaveClass(/content-header-hide-scroll-partner/);
    });

    test('should keep hide behavior after removing and re-inserting the header', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const header = page.locator('#demo-header');
      const content = page.locator('ion-content');

      // Detach and re-attach the header element directly — `ion-toggle.checked`
      // does not fire `ionChange`, so we bypass the demo toggle.
      await page.evaluate(() => {
        const el = document.getElementById('demo-header');
        const ionContent = document.querySelector('ion-content');
        if (el && ionContent?.parentElement) {
          el.remove();
          ionContent.parentElement.insertBefore(el, ionContent);
        }
      });
      await page.waitForChanges();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-header.header-collapse-hide-hidden').waitFor();

      await expect(header).toHaveClass(/header-collapse-hide-hidden/);
    });
  });
});

/**
 * Visual regressions — keep to a single direction; behavior is direction-agnostic.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: collapse hide — visual'), () => {
    test('should not have visual regressions in the shown state', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const header = page.locator('#demo-header');
      await expect(header).toHaveScreenshot(screenshot(`header-collapse-hide-shown-diff`));
    });

    test('should not have visual regressions in the hidden state', async ({ page }) => {
      await page.goto('/src/components/header/test/hide', config);

      const content = page.locator('ion-content');
      const header = page.locator('#demo-header');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-header.header-collapse-hide-hidden').waitFor();
      // Let the slide/fade transition settle before the snapshot.
      await page.waitForTimeout(400);

      await expect(header).toHaveScreenshot(screenshot(`header-collapse-hide-hidden-diff`));
    });
  });
});
