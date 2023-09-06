import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: basic (legacy)'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/checkbox/test/legacy/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`checkbox-legacy-basic`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('checkbox: ionChange'), () => {
    test('should fire ionChange when interacting with checkbox', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox value="my-checkbox"></ion-checkbox>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const checkbox = page.locator('ion-checkbox');

      await checkbox.click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: true });

      await checkbox.click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: false });
    });

    test('should fire ionChange when interacting with checkbox in item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-checkbox value="my-checkbox"></ion-checkbox>
        </ion-item>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const item = page.locator('ion-item');

      await item.click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: true });

      await item.click();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'my-checkbox', checked: false });
    });

    test('should not fire when programmatically setting a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox value="my-checkbox"></ion-checkbox>
      `,
        config
      );

      const ionChange = await page.spyOnEvent('ionChange');
      const checkbox = page.locator('ion-checkbox');

      await checkbox.evaluate((el: HTMLIonCheckboxElement) => (el.checked = true));
      await expect(ionChange).not.toHaveReceivedEvent();
    });
  });

  test(title('clicking padded space within item should click the checkbox'), async ({ page }) => {
    await page.setContent(
      `
      <ion-item>
        <ion-checkbox legacy="true" value="my-checkbox"></ion-checkbox>
      </ion-item>
    `,
      config
    );
    const itemNative = page.locator('.item-native');
    const ionChange = await page.spyOnEvent('ionChange');

    // Clicks the padded space within the item
    await itemNative.click({
      position: {
        x: 5,
        y: 5,
      },
    });

    expect(ionChange).toHaveReceivedEvent();
  });
});
