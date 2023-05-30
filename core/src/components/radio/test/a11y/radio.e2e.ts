import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio: a11y'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/radio/test/a11y`, config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe(title('radio: keyboard navigation'), () => {
    test.beforeEach(async ({ page, skip }) => {
      // TODO (FW-2979)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

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
