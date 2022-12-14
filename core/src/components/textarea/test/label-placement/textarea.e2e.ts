import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: label placement start', () => {
  test('label should appear on the starting side of the textarea', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Standard" value="Lorem ipsum" label-placement="start"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-placement-start-${page.getSnapshotSettings()}.png`);
  });
  test('textarea should render multiple lines of text', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Standard" label-placement="start" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-start-multi-line-value-${page.getSnapshotSettings()}.png`
    );
  });

  test('label should be truncated', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="start"></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-start-label-truncated-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: label placement end', () => {
  test('label should appear on the ending side of the textarea', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Standard" value="Lorem ipsum" label-placement="end"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-placement-end-${page.getSnapshotSettings()}.png`);
  });
  test('textarea should render multiple lines of text', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Standard" label-placement="end" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-end-multi-line-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should be truncated', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="end"></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-end-label-truncated-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: label placement fixed', () => {
  test('label should appear on the starting side of the textarea and have a fixed width', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Standard" value="Lorem ipsum" label-placement="fixed"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-placement-fixed-${page.getSnapshotSettings()}.png`);
  });
  test('textarea should render multiple lines of text', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Standard" label-placement="fixed" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-fixed-multi-line-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should be truncated', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="fixed"></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-fixed-label-truncated-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: label placement stacked', () => {
  test('label should appear above the textarea when there is a value', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Standard" value="Lorem ipsum" label-placement="stacked"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-stacked-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear above the textarea when there is a no value', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Standard" label-placement="stacked"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-stacked-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('textarea should render multiple lines of text', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Standard" label-placement="stacked" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-stacked-multi-line-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should be truncated', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="stacked"></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-stacked-label-truncated-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('textarea: label placement floating', () => {
  test('label should appear above the textarea when there is a value', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Standard" value="Lorem ipsum" label-placement="floating"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear on top of the textarea and hide the textarea when there is a no value', async ({
    page,
  }) => {
    await page.setContent(`
      <ion-textarea label="Standard" label-placement="floating" placeholder="Placeholder"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should appear on top of the textarea when the textarea is focused', async ({ page }) => {
    await page.setContent(`
      <ion-textarea label="Standard" label-placement="floating" placeholder="Placeholder"></ion-textarea>
    `);

    const textarea = page.locator('ion-textarea');
    const nativeTextarea = textarea.locator('textarea');

    await nativeTextarea.click();
    await page.waitForChanges();

    expect(await textarea.screenshot({ animations: 'disabled' })).toMatchSnapshot(
      `textarea-focused-placement-floating-no-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('textarea should render multiple lines of text', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Standard" label-placement="floating" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-multi-line-value-${page.getSnapshotSettings()}.png`
    );
  });
  test('label should be truncated', async ({ page }) => {
    await page.setContent(`
    <ion-textarea label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." label-placement="floating"></ion-textarea>
  `);

    const textarea = page.locator('ion-textarea');
    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-placement-floating-label-truncated-${page.getSnapshotSettings()}.png`
    );
  });
});
