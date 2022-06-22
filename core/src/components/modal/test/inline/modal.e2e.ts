import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('modal: inline', () => {
  test('it should present and then remain in the dom on dismiss', async ({ page }) => {
    await page.goto('/src/components/modal/test/inline');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

    await page.click('#open-inline-modal');

    await ionModalDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(`modal-inline-present-${page.getSnapshotSettings()}.png`);

    const modal = await page.locator('ion-modal');
    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

    await ionModalDidDismiss.next();
    await page.waitForSelector('ion-modal', { state: 'hidden' });

    expect(await page.screenshot()).toMatchSnapshot(`modal-inline-dismiss-${page.getSnapshotSettings()}.png`);
  });
});
