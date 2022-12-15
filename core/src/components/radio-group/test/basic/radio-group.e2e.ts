import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

test.describe('radio-group: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/radio-group/test/basic`);

    const list = page.locator('ion-list');

    expect(await list.screenshot()).toMatchSnapshot(`radio-group-diff-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('radio-group: interaction', () => {
  let radioFixture: RadioFixture;

  test.beforeEach(({ page, skip }) => {
    skip.rtl();
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

  test('programmatically assigning a value should update the checked radio', async ({ page }) => {
    await page.setContent(`
      <ion-radio-group value="1">
        <ion-item>
          <ion-label>Item 1</ion-label>
          <ion-radio value="1" slot="start"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Item 2</ion-label>
          <ion-radio value="2" slot="start"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Item 3</ion-label>
          <ion-radio value="3" slot="start"></ion-radio>
        </ion-item>
      </ion-radio-group>
    `);

    const radioGroup = page.locator('ion-radio-group');
    const radioOne = page.locator('ion-radio[value="1"]');
    const radioTwo = page.locator('ion-radio[value="2"]');

    await radioGroup.evaluate((el: HTMLIonRadioGroupElement) => (el.value = '2'));

    await page.waitForChanges();

    await expect(radioOne).not.toHaveClass(/radio-checked/);
    await expect(radioTwo).toHaveClass(/radio-checked/);
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
