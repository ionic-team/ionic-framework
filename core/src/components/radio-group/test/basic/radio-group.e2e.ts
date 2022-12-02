import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('radio-group: basic', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto(`/src/components/radio-group/test/basic`, config);

      const list = page.locator('ion-list');

      expect(await list.screenshot()).toMatchSnapshot(`radio-group-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('radio-group: interaction', () => {
    let radioFixture: RadioFixture;

    test.beforeEach(({ page }) => {
      radioFixture = new RadioFixture(page);
    });

    test(title('spacebar should not deselect without allowEmptySelection'), async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="one" allow-empty-selection="false">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `,
        config
      );

      await radioFixture.checkRadio('keyboard');
      await radioFixture.expectChecked(true);
    });

    test(title('spacebar should deselect with allowEmptySelection'), async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="one" allow-empty-selection="true">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `,
        config
      );

      await radioFixture.checkRadio('keyboard');
      await radioFixture.expectChecked(false);
    });

    test(title('click should not deselect without allowEmptySelection'), async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="one" allow-empty-selection="false">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `,
        config
      );

      await radioFixture.checkRadio('mouse');
      await radioFixture.expectChecked(true);
    });

    test(title('click should deselect with allowEmptySelection'), async ({ page }) => {
      await page.setContent(
        `
        <ion-radio-group value="one" allow-empty-selection="true">
          <ion-item>
            <ion-label>One</ion-label>
            <ion-radio id="one" value="one"></ion-radio>
          </ion-item>
        </ion-radio-group>
      `,
        config
      );

      await radioFixture.checkRadio('mouse');
      await radioFixture.expectChecked(false);
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
