import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: bottom content', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should not render bottom content if no hint or counter is enabled', async ({ page, skip }) => {
    skip.mode('ios', 'Rendering is the same across modes');
    await page.setContent(`<ion-input label="my input"></ion-input>`);

    const bottomEl = page.locator('ion-input .input-bottom');
    await expect(bottomEl).toHaveCount(0);
  });
  test('entire input component should render correctly with no fill', async ({ page }) => {
    await page.setContent(`
      <ion-input value="hi@ionic.io" label="Email" helper-text="Enter an email" maxlength="20" counter="true"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-full-bottom-no-fill-${page.getSnapshotSettings()}.png`);
  });
  test('entire input component should render correctly with solid fill', async ({ page }) => {
    await page.setContent(`
      <ion-input fill="solid" value="hi@ionic.io" label="Email" helper-text="Enter an email" maxlength="20" counter="true"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-full-bottom-solid-${page.getSnapshotSettings()}.png`);
  });
  test('entire input component should render correctly with outline fill', async ({ page }) => {
    await page.setContent(`
      <ion-input fill="outline" value="hi@ionic.io" label="Email" helper-text="Enter an email" maxlength="20" counter="true"></ion-input>
    `);
    const input = page.locator('ion-input');
    expect(await input.screenshot()).toMatchSnapshot(`input-full-bottom-outline-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('input: hint text', () => {
  test.describe('input: hint text functionality', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
      skip.mode('ios', 'Rendering is the same across modes');
    });
    test('helper text should be visible initially', async ({ page }) => {
      await page.setContent(`<ion-input helper-text="my helper" error-text="my error" label="my input"></ion-input>`);

      const helperText = page.locator('ion-input .helper-text');
      const errorText = page.locator('ion-input .error-text');
      await expect(helperText).toBeVisible();
      await expect(helperText).toHaveText('my helper');
      await expect(errorText).toBeHidden();
    });
    test('error text should be visible when input is invalid', async ({ page }) => {
      await page.setContent(
        `<ion-input class="ion-invalid ion-touched" helper-text="my helper" error-text="my error" label="my input"></ion-input>`
      );

      const helperText = page.locator('ion-input .helper-text');
      const errorText = page.locator('ion-input .error-text');
      await expect(helperText).toBeHidden();
      await expect(errorText).toBeVisible();
      await expect(errorText).toHaveText('my error');
    });
    test('error text should change when variable is customized', async ({ page }) => {
      await page.setContent(`
        <style>
          ion-input.custom-input {
            --highlight-color-invalid: purple;
          }
        </style>
        <ion-input class="ion-invalid ion-touched custom-input" label="my label" error-text="my error"></ion-input>
      `);

      const errorText = page.locator('ion-input .error-text');
      expect(await errorText.screenshot()).toMatchSnapshot(
        `input-error-custom-color-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('input: hint text rendering', () => {
    test.describe('regular inputs', () => {
      test('should not have visual regressions when rendering helper text', async ({ page }) => {
        await page.setContent(`<ion-input helper-text="my helper" label="my input"></ion-input>`);

        const bottomEl = page.locator('ion-input .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `input-bottom-content-helper-${page.getSnapshotSettings()}.png`
        );
      });
      test('should not have visual regressions when rendering error text', async ({ page }) => {
        await page.setContent(`<ion-input class="ion-invalid ion-touched" error-text="my helper" label="my input"></ion-input>`);

        const bottomEl = page.locator('ion-input .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `input-bottom-content-error-${page.getSnapshotSettings()}.png`
        );
      });
    });
  });
});
test.describe('input: counter', () => {
  test.describe('input: counter functionality', () => {
    test.beforeEach(({ skip }) => {
      skip.rtl();
      skip.mode('ios', 'Rendering is the same across modes');
    });
    test('should not activate if maxlength is not specified even if bottom content is visible', async ({ page }) => {
      await page.setContent(`
        <ion-input label="my label" counter="true" helper-text="helper text"></ion-input>
      `);
      const itemCounter = page.locator('ion-input .counter');
      await expect(itemCounter).toBeHidden();
    });
    test('default formatter should be used', async ({ page }) => {
      await page.setContent(`
        <ion-input label="my label" counter="true" maxlength="20"></ion-input>
      `);
      const itemCounter = page.locator('ion-input .counter');
      expect(await itemCounter.textContent()).toBe('0 / 20');
    });
    test('custom formatter should be used when provided', async ({ page }) => {
      await page.setContent(`
        <ion-input label="my label" counter="true" maxlength="20"></ion-input>

        <script>
          const input = document.querySelector('ion-input');
          input.counterFormatter = (inputLength, maxLength) => {
            const length = maxLength - inputLength;
            return length.toString() + ' characters left';
          };
        </script>
      `);

      const input = page.locator('ion-input input');
      const itemCounter = page.locator('ion-input .counter');
      expect(await itemCounter.textContent()).toBe('20 characters left');

      await input.click();
      await input.type('abcde');

      await page.waitForChanges();

      expect(await itemCounter.textContent()).toBe('15 characters left');
    });
  });
  test.describe('input: counter rendering', () => {
    test.describe('regular inputs', () => {
      test('should not have visual regressions when rendering counter', async ({ page }) => {
        await page.setContent(`<ion-input counter="true" maxlength="20" label="my input"></ion-input>`);

        const bottomEl = page.locator('ion-input .input-bottom');
        expect(await bottomEl.screenshot()).toMatchSnapshot(
          `input-bottom-content-counter-${page.getSnapshotSettings()}.png`
        );
      });
    });
  });
});
