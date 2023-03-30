import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: label placement start', () => {
  test('label should appear on the starting side of the input', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" value="example@ionic.io" label-placement="start"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-placement-start-${page.getSnapshotSettings()}.png`);
  });

  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="start"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-start-long-label-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('input: label placement end', () => {
  test('label should appear on the ending side of the input', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" value="example@ionic.io" label-placement="end"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-placement-end-${page.getSnapshotSettings()}.png`);
  });
  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="end"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-end-long-label-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('input: label placement fixed', () => {
  test('label should appear on the starting side of the input, have a fixed width, and show ellipses', async ({
    page,
  }) => {
    await page.setContent(`
      <ion-input label="Email Email Email Email Email Email" value="example@ionic.io" label-placement="fixed"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-placement-fixed-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('input: label placement stacked', () => {
  test('label should appear above the input when there is a value', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" value="example@ionic.io" label-placement="stacked"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-placement-stacked-value-${page.getSnapshotSettings()}.png`);
  });
  test('label should appear above the input when there is a no value', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" label-placement="stacked"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-stacked-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="stacked"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-stacked-long-label-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('input: label placement floating', () => {
  test('label should appear above the input when there is a value', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" value="example@ionic.io" label-placement="floating"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-floating-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear on top of the input and hide the input when there is a no value', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" label-placement="floating" placeholder="example@ionic.io"></ion-input>
    `);

    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-floating-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear on top of the input when the input is focused', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email" label-placement="floating" placeholder="example@ionic.io"></ion-input>
    `);

    const input = page.locator('ion-input');
    const nativeInput = input.locator('input');

    await nativeInput.click();
    await page.waitForChanges();

    expect(await input.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `input-focused-placement-floating-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('long label should truncate', async ({ page }) => {
    await page.setContent(`
      <ion-input label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-floating-long-label-${page.getSnapshotSettings()}.png`
    );
  });

  test('long label should truncate with outline', async ({ page, skip }) => {
    skip.mode('ios', 'This style only appears on MD');
    await page.setContent(`
      <ion-input fill="outline" label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-floating-long-label-outline-${page.getSnapshotSettings()}.png`
    );
  });
  test('long label should truncate with solid', async ({ page, skip }) => {
    skip.mode('ios', 'This style only appears on MD');
    await page.setContent(`
      <ion-input fill="solid" label="Email Email Email Email Email Email Email Email Email Email Email Email" value="example@ionic.io" label-placement="floating"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(
      `input-placement-floating-long-label-solid-${page.getSnapshotSettings()}.png`
    );
  });
});
