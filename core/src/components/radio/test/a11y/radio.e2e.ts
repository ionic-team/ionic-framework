import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('radio: a11y'), () => {
    test('default layout should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-radio>my label</ion-radio>
          <ion-radio aria-label="my aria label"></ion-radio>
          <ion-radio-group>
            <ion-radio>my label in a group</ion-radio>
          </ion-radio-group>
          <ion-radio-group>
            <ion-radio aria-label="my aria label in a group"></ion-radio>
          </ion-radio-group>
          <ion-list>
            <ion-item>
              <ion-radio-group>
                <ion-radio>my label in a group in a list</ion-radio>
              </ion-radio-group>
            </ion-item>
          </ion-list>
          <ion-list>
            <ion-item>
              <ion-radio-group>
                <ion-radio aria-label="my aria label in a group in a list"></ion-radio>
              </ion-radio-group>
            </ion-item>
          </ion-list>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('selected state should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-radio-group value="a">
            <ion-radio value="a">Selected radio</ion-radio>
          </ion-radio-group>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
    test.describe(title('radio: keyboard navigation'), () => {
      test.beforeEach(async ({ page, browserName }) => {
        await page.setContent(
          `
        <ion-app>
          <ion-content>
            <ion-list>
              <ion-radio-group id="first-group" value="huey">
                <ion-item>
                  <ion-radio value="huey">Huey</ion-radio>
                </ion-item>
                <ion-item>
                  <ion-radio value="dewey">Dewey</ion-radio>
                </ion-item>
                <ion-item>
                  <ion-radio value="fooey" disabled>Fooey</ion-radio>
                </ion-item>
                <ion-item>
                  <ion-radio value="louie">Louie</ion-radio>
                </ion-item>
              </ion-radio-group>
            </ion-list>
            <ion-list>
              <ion-radio-group id="second-group" value="huey">
                <ion-item>
                  <ion-radio value="huey">Huey</ion-radio>
                </ion-item>
                <ion-item>
                  <ion-radio value="dewey">Dewey</ion-radio>
                </ion-item>
                <ion-item>
                  <ion-radio value="fooey" disabled>Fooey</ion-radio>
                </ion-item>
                <ion-item>
                  <ion-radio value="louie">Louie</ion-radio>
                </ion-item>
              </ion-radio-group>
            </ion-list>
          </ion-content>
        </ion-app>
      `,
          config
        );

        if (browserName === 'webkit') {
          const radio = page.locator('#first-group ion-radio').first();
          /**
           * Sometimes Safari does not focus the first radio.
           * This is a workaround to ensure the first radio is focused.
           *
           * Wait for the first radio to be rendered before tabbing.
           * This is necessary because the first radio may not be rendered
           * when the page first loads.
           *
           * This would cause the first radio to be skipped when tabbing.
           */
          await radio.waitFor();
        }
      });

      test('tabbing should switch between radio groups', async ({ page, pageUtils }) => {
        const firstGroupRadios = page.locator('#first-group ion-radio');
        const secondGroupRadios = page.locator('#second-group ion-radio');

        await pageUtils.pressKeys('Tab');
        await expect(firstGroupRadios.nth(0)).toBeFocused();

        await pageUtils.pressKeys('Tab');
        await expect(secondGroupRadios.nth(0)).toBeFocused();

        await pageUtils.pressKeys('shift+Tab');
        await expect(firstGroupRadios.nth(0)).toBeFocused();
      });
      test('using arrow keys should move between enabled radios within group', async ({ page, pageUtils }) => {
        const firstGroupRadios = page.locator('#first-group ion-radio');

        await pageUtils.pressKeys('Tab');
        await expect(firstGroupRadios.nth(0)).toBeFocused();

        await page.keyboard.press('ArrowDown');
        await expect(firstGroupRadios.nth(1)).toBeFocused();

        // firstGroupRadios.nth(2) is disabled so it should not receive focus.
        await page.keyboard.press('ArrowDown');
        await expect(firstGroupRadios.nth(3)).toBeFocused();

        await page.keyboard.press('ArrowDown');
        await expect(firstGroupRadios.nth(0)).toBeFocused();

        await page.keyboard.press('ArrowUp');
        await expect(firstGroupRadios.nth(3)).toBeFocused();
      });
    });
  });
});

/**
 * These tests assert the `ion-focusable` gating class the component controls,
 * not the rendered focus ring. `ion-focused` is not asserted directly because
 * it depends on keyboard-mode detection, which is unreliable on WebKit. The
 * gating logic does not vary across modes.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('radio: focus indicator'), () => {
    test('standalone radio should be focusable', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-radio-group value="a">
            <ion-radio value="a" aria-label="Radio">Radio</ion-radio>
          </ion-radio-group>
        </ion-app>
      `,
        config
      );

      const radio = page.locator('ion-radio');
      await expect(radio).toHaveClass(/ion-focusable/);
    });

    test('radio in a single-input item should not show its own focus indicator', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-radio-group value="a">
            <ion-item>
              <ion-radio value="a">Radio</ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-app>
      `,
        config
      );

      // The item owns the focus indicator for single-input items, so the radio
      // must not become focusable itself.
      const radio = page.locator('ion-radio');
      const item = page.locator('ion-item');
      await expect(radio).not.toHaveClass(/ion-focusable/);
      await expect(item).toHaveClass(/ion-focusable/);
    });

    test('radio in a multi-input item should be focusable', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-radio-group value="a">
              <ion-radio value="a">Radio 1</ion-radio>
            </ion-radio-group>
            <ion-radio-group value="b">
              <ion-radio value="b">Radio 2</ion-radio>
            </ion-radio-group>
          </ion-item>
        </ion-app>
      `,
        config
      );

      // Multi-input items do not draw a single focus indicator, so each control
      // must be able to show its own.
      const radios = page.locator('ion-radio');
      await expect(radios.nth(0)).toHaveClass(/ion-focusable/);
      await expect(radios.nth(1)).toHaveClass(/ion-focusable/);
    });
  });
});

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-radio-group value="a">
          <ion-radio value="a">Radio Label</ion-alert>
        </ion-radio-group>
      `,
        config
      );

      const radioGroup = page.locator('ion-radio-group');
      await expect(radioGroup).toHaveScreenshot(screenshot(`radio-scale`));
    });
  });
});
