import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/toggle/test/basic`);
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`toggle-diff-${page.getSnapshotSettings()}.png`);
  });

  test('should have proper class and aria role when checked', async ({ page }) => {
    const toggle = page.locator('#orange');

    await expect(toggle).not.toHaveClass(/toggle-checked/);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    await toggle.click();
    await page.waitForChanges();

    await expect(toggle).toHaveClass(/toggle-checked/);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    await toggle.click();
    await page.waitForChanges();

    await expect(toggle).not.toHaveClass(/toggle-checked/);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  test('should fire change event with detail', async ({ page }) => {
    const toggle = page.locator('#orange');
    const ionChange = await page.spyOnEvent('ionChange');

    await toggle.click();
    await page.waitForChanges();

    expect(ionChange).toHaveReceivedEventDetail({
      checked: true,
      value: 'on',
    });

    await toggle.click();
    await page.waitForChanges();

    expect(ionChange).toHaveReceivedEventDetail({
      checked: false,
      value: 'on',
    });
  });

  test('should fire change event if checked prop is changed directly', async ({ page }) => {
    const toggle = page.locator('#orange');
    const ionChange = await page.spyOnEvent('ionChange');

    await toggle.evaluate((el: HTMLIonToggleElement) => (el.checked = true));
    await page.waitForChanges();

    expect(ionChange).toHaveReceivedEvent();
  });

  test('should pass properties down to hidden input', async ({ page }) => {
    const toggle = page.locator('#grapeChecked');

    await expect(toggle).toHaveJSProperty('disabled', true);
    await expect(toggle).toHaveJSProperty('value', 'grape');
    await expect(toggle).toHaveJSProperty('name', 'grape');

    const hiddenInput = page.locator('#grapeChecked input[type=hidden]');

    await expect(hiddenInput).toBeDisabled();
    await expect(hiddenInput).toHaveJSProperty('value', 'grape');
    await expect(hiddenInput).toHaveJSProperty('name', 'grape');

    await toggle.evaluate((el: HTMLIonToggleElement) => {
      el.disabled = false;
      el.checked = false;
      el.value = 'new-value';
      el.name = 'new-name';
    });

    await page.waitForChanges();

    await expect(hiddenInput).not.toBeDisabled();
    await expect(hiddenInput).toHaveJSProperty('name', 'new-name');

    // shouldn't have a value because it's unchecked
    // note: using toHaveJSProperty to check empty string triggers error for some reason
    const value = await hiddenInput.evaluate((el: HTMLInputElement) => el.value);
    expect(value).toBe('');
  });
});
