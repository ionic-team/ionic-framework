import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * `collapse="hide"` applies to all themes (ios, md, ionic) for `ion-footer`.
 * The interactive demo with both header and footer hide lives at
 * `/src/components/header/test/hide` — these tests drive that shared page
 * from the footer's perspective.
 *
 * The interaction (see `@utils/on-scroll/collapse-hide.utils`):
 *   - Hides after >= 24px cumulative downward scroll
 *   - Shows after >= 5px cumulative upward scroll
 *   - Opposing direction drains (not resets) the other accumulator,
 *     so inertial-scroll jitter doesn't stall either transition.
 */
const DEMO_PATH = '/src/components/header/test/hide';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('footer: collapse hide — behavior'), () => {
    test('should hide the footer after cumulative downward scroll past threshold', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const footer = page.locator('#demo-footer');
      const content = page.locator('ion-content');

      await expect(footer).not.toHaveClass(/footer-collapse-hide-hidden/);

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 40, 0);
      });
      await page.locator('#demo-footer.footer-collapse-hide-hidden').waitFor();

      await expect(footer).toHaveClass(/footer-collapse-hide-hidden/);
    });

    test('should show the footer again after cumulative upward scroll past threshold', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const footer = page.locator('#demo-footer');
      const content = page.locator('ion-content');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-footer.footer-collapse-hide-hidden').waitFor();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, -20, 0);
      });
      await page.waitForChanges();

      await expect(footer).not.toHaveClass(/footer-collapse-hide-hidden/);
    });

    test('should not hide the footer below the cumulative downward threshold', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const footer = page.locator('#demo-footer');
      const content = page.locator('ion-content');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 10, 0);
      });
      await page.waitForChanges();

      await expect(footer).not.toHaveClass(/footer-collapse-hide-hidden/);
    });

    test('should set inert and aria-hidden on the footer when it hides', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const footer = page.locator('#demo-footer');
      const content = page.locator('ion-content');

      expect(await footer.getAttribute('inert')).toBeNull();
      expect(await footer.getAttribute('aria-hidden')).toBeNull();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-footer.footer-collapse-hide-hidden').waitFor();

      await expect(footer).toHaveAttribute('inert', '');
      await expect(footer).toHaveAttribute('aria-hidden', 'true');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, -20, 0);
      });
      await page.waitForChanges();

      expect(await footer.getAttribute('inert')).toBeNull();
      expect(await footer.getAttribute('aria-hidden')).toBeNull();
    });

    test('should add the footer partner class and slide CSS variable to ion-content', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const content = page.locator('ion-content');

      await expect(content).toHaveClass(/content-footer-hide-scroll-partner/);

      // Slide distance is set at runtime by createCollapseHideInteraction
      // via readTask/writeTask, so poll until it lands on a positive value.
      await expect
        .poll(async () => content.evaluate((el: HTMLElement) => el.style.getPropertyValue('--footer-hide-slide-y')))
        .toMatch(/^[1-9]\d*px$/);
    });

    test('should toggle the content-footer-hide-scroll-hidden class together with the footer', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const content = page.locator('ion-content');

      await expect(content).not.toHaveClass(/content-footer-hide-scroll-hidden/);

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('ion-content.content-footer-hide-scroll-hidden').waitFor();

      await expect(content).toHaveClass(/content-footer-hide-scroll-hidden/);

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, -20, 0);
      });
      await page.waitForChanges();

      await expect(content).not.toHaveClass(/content-footer-hide-scroll-hidden/);
    });

    test('should stop hiding when collapse is removed', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const footer = page.locator('#demo-footer');
      const content = page.locator('ion-content');

      // Remove the `collapse` attribute directly — `ion-toggle.checked = false`
      // does not fire `ionChange`, so we bypass the demo toggle.
      await footer.evaluate((el: HTMLElement) => el.removeAttribute('collapse'));
      await page.waitForChanges();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.waitForChanges();

      await expect(footer).not.toHaveClass(/footer-collapse-hide-hidden/);
      await expect(content).not.toHaveClass(/content-footer-hide-scroll-partner/);
    });

    test('should keep hide behavior after removing and re-inserting the footer', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const footer = page.locator('#demo-footer');
      const content = page.locator('ion-content');

      // Detach and re-attach the footer element directly — `ion-toggle.checked`
      // does not fire `ionChange`, so we bypass the demo toggle.
      await page.evaluate(() => {
        const el = document.getElementById('demo-footer');
        const ionContent = document.querySelector('ion-content');
        if (el && ionContent?.parentElement) {
          el.remove();
          ionContent.parentElement.insertBefore(el, ionContent.nextSibling);
        }
      });
      await page.waitForChanges();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-footer.footer-collapse-hide-hidden').waitFor();

      await expect(footer).toHaveClass(/footer-collapse-hide-hidden/);
    });
  });
});

/**
 * Visual regressions — keep to a single direction; behavior is direction-agnostic.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('footer: collapse hide — visual'), () => {
    test('should not have visual regressions in the shown state', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const footer = page.locator('#demo-footer');
      await expect(footer).toHaveScreenshot(screenshot(`footer-collapse-hide-shown-diff`));
    });

    test('should not have visual regressions in the hidden state', async ({ page }) => {
      await page.goto(DEMO_PATH, config);

      const content = page.locator('ion-content');
      const footer = page.locator('#demo-footer');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollByPoint(0, 200, 0);
      });
      await page.locator('#demo-footer.footer-collapse-hide-hidden').waitFor();
      // Let the slide/fade transition settle before the snapshot.
      await page.waitForTimeout(400);

      await expect(footer).toHaveScreenshot(screenshot(`footer-collapse-hide-hidden-diff`));
    });
  });
});
