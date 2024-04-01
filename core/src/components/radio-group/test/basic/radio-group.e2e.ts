import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

import { RadioFixture } from '../fixtures';

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
            <ion-radio id="one" value="one">One</ion-radio>
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
            <ion-radio id="one" value="one">One</ion-radio>
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
            <ion-radio id="one" value="one">One</ion-radio>
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
            <ion-radio id="one" value="one">One</ion-radio>
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
            <ion-radio value="1">Item 1</ion-radio>
          </ion-item>

          <ion-item>
            <ion-radio value="2">Item 2</ion-radio>
          </ion-item>

          <ion-item>
            <ion-radio value="3">Item 3</ion-radio>
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
