import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

test.describe('radio-group', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This does not test LTR vs RTL logic.');
  });

  test.describe('radio-group: interaction', () => {
    let radioFixture: RadioFixture;

    test.beforeEach(({ page }) => {
      radioFixture = new RadioFixture(page);
    });

    test('spacebar should not deselect without allowEmptySelection', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="one" allow-empty-selection="false">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `);

      await radioFixture.checkRadio('keyboard');
      await radioFixture.expectChecked(true);
    });

    test('spacebar should deselect with allowEmptySelection', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="one" allow-empty-selection="true">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `);

      await radioFixture.checkRadio('keyboard');
      await radioFixture.expectChecked(false);
    });

    test('click should not deselect without allowEmptySelection', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="one" allow-empty-selection="false">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `);

      await radioFixture.checkRadio('mouse');
      await radioFixture.expectChecked(true);
    });

    test('click should deselect with allowEmptySelection', async ({ page }) => {
      await page.setContent(`
        <ion-radio-group value="one" allow-empty-selection="true">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `);

      await radioFixture.checkRadio('mouse');
      await radioFixture.expectChecked(false);
    });
  });
  test.describe('radio-group: state', () => {
    test('radio should remain checked after being removed/readded to the dom', async ({ page }) => {
      await page.goto('/src/components/radio-group/test/search');

      const radioGroup = page.locator('ion-radio-group');
      const radio = page.locator('ion-radio[value=two]');

      // select radio
      await radio.click();
      await expect(radio.locator('input')).toHaveJSProperty('checked', true);

      // filter radio so it is not in DOM
      await page.fill('ion-searchbar input', 'zero');
      await page.waitForChanges();
      expect(radio).toBeHidden();

      // ensure radio group has the same value
      expect(radioGroup).toHaveJSProperty('value', 'two');

      // clear the search so the radio appears
      await page.fill('ion-searchbar input', '');
      await page.waitForChanges();

      // ensure that the new radio instance is still checked
      await expect(radio.locator('input')).toHaveJSProperty('checked', true);
    });
  });
});

class RadioFixture {
  readonly page: E2EPage;

  private radio!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async checkRadio(method: 'keyboard' | 'mouse', selector = 'ion-radio') {
    const { page } = this;
    const radio = (this.radio = page.locator(selector));

    if (method === 'keyboard') {
      await radio.focus();
      await page.keyboard.press('Space');
    } else {
      await radio.click();
    }

    await page.waitForChanges();

    return radio;
  }

  async expectChecked(state: boolean) {
    const { radio } = this;
    await expect(radio.locator('input')).toHaveJSProperty('checked', state);
  }
}
