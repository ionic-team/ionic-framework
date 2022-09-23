import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/textarea/test/basic`);

    /**
     * The auto grow implementation uses a requestAnimationFrame to append styles to the textarea
     * on load. We need to wait for changes otherwise the screenshot can be taken before the
     * styles are applied.
     */
    await page.waitForChanges();

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`textarea-diff-${page.getSnapshotSettings()}.png`);
  });

  test.describe('with floating labels', () => {
    /**
     * Verifies the display of a floating label above an `ion-textarea`.
     * Captures a screenshot of the initial state (without a value) and verifies
     * that the label translates correctly after the value is set.
     */
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(`
      <ion-item>
        <ion-label position="floating">Floating Label</ion-label>
        <ion-textarea></ion-textarea>
      </ion-item>`);

      const item = page.locator('ion-item');
      const textarea = page.locator('ion-textarea');

      expect(await item.screenshot()).toMatchSnapshot(
        `textarea-floating-label-initial-${page.getSnapshotSettings()}.png`
      );

      await textarea.evaluate((el: HTMLIonTextareaElement) => {
        el.value = 'Updated value';
      });

      await page.waitForChanges();

      await page.setIonViewport();

      expect(await item.screenshot()).toMatchSnapshot(`textarea-floating-label-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});

test.describe('textarea: clearOnEdit', () => {
  test('should clear the textarea on first keystroke of textarea being focused', async ({ page }) => {
    await page.setContent(`<ion-textarea value="some value" clear-on-edit="true"></ion-textarea>`);

    const textarea = page.locator('ion-textarea');

    await textarea.click();
    await textarea.type('h');

    expect(await textarea.evaluate((el: HTMLIonTextareaElement) => el.value)).toBe('h');

    await textarea.type('ello world');

    expect(await textarea.evaluate((el: HTMLIonTextareaElement) => el.value)).toBe('hello world');
  });

  test('should not clear the textarea if it does not have an initial value when typing', async ({ page }) => {
    await page.setContent(`<ion-textarea value="" clear-on-edit="true"></ion-textarea>`);

    const textarea = page.locator('ion-textarea');

    await textarea.click();
    await textarea.type('hello world');

    expect(await textarea.evaluate((el: HTMLIonTextareaElement) => el.value)).toBe('hello world');
  });
});
