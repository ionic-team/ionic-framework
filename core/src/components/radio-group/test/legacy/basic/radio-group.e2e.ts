import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('radio-group: basic'),
      () => {
        test('should not have visual regressions', async ({
          page,
        }) => {
          await page.goto(
            `/src/components/radio-group/test/legacy/basic`,
            config
          );

          const list =
            page.locator('ion-list');

          await expect(
            list
          ).toHaveScreenshot(
            screenshot(
              `radio-group-diff`
            )
          );
        });
      }
    );
  }
);

/**
 * This behavior does not vary across modes/directions.
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('radio-group: interaction'),
    () => {
      let radioFixture: RadioFixture;

      test.beforeEach(({ page }) => {
        radioFixture = new RadioFixture(
          page
        );
      });

      test('spacebar should not deselect without allowEmptySelection', async ({
        page,
      }) => {
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

        await radioFixture.checkRadio(
          'keyboard'
        );
        await radioFixture.expectChecked(
          true
        );
      });

      test('spacebar should deselect with allowEmptySelection', async ({
        page,
      }) => {
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

        await radioFixture.checkRadio(
          'keyboard'
        );
        await radioFixture.expectChecked(
          false
        );
      });

      test('click should not deselect without allowEmptySelection', async ({
        page,
      }) => {
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

        await radioFixture.checkRadio(
          'mouse'
        );
        await radioFixture.expectChecked(
          true
        );
      });

      test('click should deselect with allowEmptySelection', async ({
        page,
      }) => {
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

        await radioFixture.checkRadio(
          'mouse'
        );
        await radioFixture.expectChecked(
          false
        );
      });

      test('programmatically assigning a value should update the checked radio', async ({
        page,
      }) => {
        await page.setContent(
          `
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
      `,
          config
        );

        const radioGroup = page.locator(
          'ion-radio-group'
        );
        const radioOne = page.locator(
          'ion-radio[value="1"]'
        );
        const radioTwo = page.locator(
          'ion-radio[value="2"]'
        );

        await radioGroup.evaluate(
          (
            el: HTMLIonRadioGroupElement
          ) => (el.value = '2')
        );

        await page.waitForChanges();

        await expect(
          radioOne
        ).not.toHaveClass(
          /radio-checked/
        );
        await expect(
          radioTwo
        ).toHaveClass(/radio-checked/);
      });
    }
  );
});

class RadioFixture {
  readonly page: E2EPage;

  private radio!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async checkRadio(
    method: 'keyboard' | 'mouse',
    selector = 'ion-radio'
  ) {
    const { page } = this;
    const radio = (this.radio =
      page.locator(selector));

    if (method === 'keyboard') {
      await radio.focus();
      await page.keyboard.press(
        'Space'
      );
    } else {
      await radio.click();
    }

    await page.waitForChanges();

    return radio;
  }

  async expectChecked(state: boolean) {
    const { radio } = this;
    await expect(
      radio.locator('input')
    ).toHaveJSProperty(
      'checked',
      state
    );
  }
}
