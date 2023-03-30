import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

/**
 * By default ion-select only takes up
 * as much space as it needs. Justification is
 * used for when the select takes up the full
 * line (such as in an ion-item). As a result,
 * we set the width of the select so we can
 * see the justification results.
 */
test.describe('select: label', () => {
  test.describe('select: start placement', () => {
    test('should render a start justification with label in the start position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="start" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-start-justify-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render an end justification with label in the start position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="end" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-start-justify-end-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render a space between justification with label in the start position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="start" justify="space-between" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-start-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('select: end placement', () => {
    test('should render a start justification with label in the end position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="start" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-end-justify-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render an end justification with label in the end position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="end" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-end-justify-end-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render a space between justification with label in the end position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="end" justify="space-between" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-end-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('select: fixed placement', () => {
    test('should render a start justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="start" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-fixed-justify-start-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render an end justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="end" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-fixed-justify-end-${page.getSnapshotSettings()}.png`
      );
    });
    test('should render a space between justification with label in the fixed position', async ({ page }) => {
      await page.setContent(`

        <ion-select label="Label" placeholder="Select an Item" label-placement="fixed" justify="space-between" style="width: 200px"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-fixed-justify-space-between-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('select: floating placement', () => {
    test('label should appear above the select when there is a value', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" value="apples" label-placement="floating">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-floating-value-${page.getSnapshotSettings()}.png`
      );
    });
    test('label should appear on top of the select when there is no value', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" label-placement="floating">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-floating-no-value-${page.getSnapshotSettings()}.png`
      );
    });
    test('label should appear on top of the select when there is a placeholder and no value', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" label-placement="floating" placeholder="Placeholder">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-floating-no-value-placeholder-${page.getSnapshotSettings()}.png`
      );
    });
    test('label should appear on top of the select when the select is expanded', async ({ page }) => {
      await page.setContent(`
        <ion-select class="select-expanded" label="Label" label-placement="floating" placeholder="Select a Fruit">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');

      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-label-floating-expanded-${page.getSnapshotSettings()}.png`
      );
    });
    test('long label should truncate', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label" label-placement="floating" value="apples" placeholder="Select a Fruit">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');

      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-label-floating-long-label-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('select: stacked placement', () => {
    test('label should appear above the select when there is a value', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" value="apples" label-placement="stacked">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(`select-label-stacked-value-${page.getSnapshotSettings()}.png`);
    });
    test('label should appear above the select when there is no value', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label" label-placement="stacked">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(
        `select-label-stacked-no-value-${page.getSnapshotSettings()}.png`
      );
    });
    test('label should appear on top of the select when the select is expanded', async ({ page }) => {
      await page.setContent(`
        <ion-select class="select-expanded" label="Label" label-placement="stacked" placeholder="Select a Fruit">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');

      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-label-stacked-expanded-${page.getSnapshotSettings()}.png`
      );
    });
    test('long label should truncate', async ({ page }) => {
      await page.setContent(`
        <ion-select label="Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label" label-placement="stacked" value="apples" placeholder="Select a Fruit">
          <ion-select-option value="apples">Apples</ion-select-option>
        </ion-select>
      `);

      const select = page.locator('ion-select');

      expect(await select.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `select-label-stacked-long-label-${page.getSnapshotSettings()}.png`
      );
    });
  });

  test.describe('select: label overflow', () => {
    test('label should be truncated with ellipses', async ({ page, skip }) => {
      skip.mode('ios');
      skip.rtl();

      await page.setContent(`
        <ion-select label="Label Label Label Label Label" placeholder="Select an Item"></ion-select>
      `);

      const select = page.locator('ion-select');
      expect(await select.screenshot()).toMatchSnapshot(`select-label-truncate-${page.getSnapshotSettings()}.png`);
    });
  });
});

test.describe('select: alert label', () => {
  test('should use the label to set the default header in an alert', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');

    await page.setContent(`
      <ion-select label="My Alert" interface="alert">
        <ion-select-option value="a">A</ion-select-option>
      </ion-select>
    `);

    const select = page.locator('ion-select');
    const alert = page.locator('ion-alert');
    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

    await select.click();
    await ionAlertDidPresent.next();

    await expect(alert.locator('.alert-title')).toHaveText('My Alert');
  });
});
