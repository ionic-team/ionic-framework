import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('overlays: dismiss'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/utils/test/overlays', config);
    });
    test('hardware back button: should dismiss a presented overlay', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#create-and-present');

      await ionModalDidPresent.next();

      await page.click('#modal-simulate');

      await ionModalDidDismiss.next();
    });

    test('hardware back button: should dismiss the presented overlay, even though another hidden modal was added last', async ({
      page,
    }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#create-and-present');

      await ionModalDidPresent.next();

      await page.click('#modal-create');

      const modals = page.locator('ion-modal');
      await expect(await modals.count()).toEqual(2);

      await expect(await modals.nth(0)).not.toHaveClass(/overlay-hidden/);
      await expect(await modals.nth(1)).toHaveClass(/overlay-hidden/);

      await page.click('#modal-simulate');

      await ionModalDidDismiss.next();

      await expect(await modals.count()).toEqual(1);
      await expect(await modals.nth(0)).toHaveClass(/overlay-hidden/);
    });

    test('Esc: should dismiss a presented overlay', async ({ page }) => {
      const createAndPresentButton = page.locator('#create-and-present');

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await createAndPresentButton.click();

      await ionModalDidPresent.next();

      await page.keyboard.press('Escape');

      await ionModalDidDismiss.next();
    });

    test('Esc: should dismiss the presented overlay, even though another hidden modal was added last', async ({
      page,
    }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#create-and-present');

      await ionModalDidPresent.next();

      await page.click('#modal-create');

      const modals = page.locator('ion-modal');
      await expect(await modals.count()).toEqual(2);

      await expect(await modals.nth(0)).not.toHaveClass(/overlay-hidden/);
      await expect(await modals.nth(1)).toHaveClass(/overlay-hidden/);

      await page.keyboard.press('Escape');

      await ionModalDidDismiss.next();

      await expect(await modals.count()).toEqual(1);
      await expect(await modals.nth(0)).toHaveClass(/overlay-hidden/);
    });

    test('overlays: Nested: should dismiss the top overlay', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#create-nested');

      await ionModalDidPresent.next();

      await page.click('#dismiss-modal-nested-overlay');

      await ionModalDidDismiss.next();

      const modals = page.locator('ion-modal');
      expect(await modals.count()).toEqual(0);
    });

    test('should re-enable scrolling on the page when dismissed', async ({ page, skip }) => {
      skip.browser('webkit', 'Mouse wheel is not supported in mobile WebKit');
      await page.goto('/src/utils/test/overlays', config);

      await page.click('#create-and-present');

      const modal = page.locator('ion-modal');
      await expect(modal).toHaveCount(1);

      const contentEl = page.locator('#main-content ion-content');

      await expect(
        await contentEl.evaluate(async (el: HTMLIonContentElement) => {
          const contentScrollEl = await el.getScrollElement();
          return contentScrollEl.scrollTop;
        })
      ).toBe(0);

      await page.mouse.wheel(0, 100);

      await expect(
        await contentEl.evaluate(async (el: HTMLIonContentElement) => {
          const contentScrollEl = await el.getScrollElement();
          return contentScrollEl.scrollTop;
        })
      ).toBe(0);

      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await modal.evaluate(async (el: HTMLIonModalElement) => {
        await el.dismiss();
      });

      await ionModalDidDismiss.next();

      await page.waitForChanges();

      await page.mouse.wheel(0, 100);

      await expect(
        await contentEl.evaluate(async (el: HTMLIonContentElement) => {
          const contentScrollEl = await el.getScrollElement();
          return contentScrollEl.scrollTop;
        })
      ).toBeGreaterThan(0);
    });
  });

  test.describe(title('overlays: focus'), () => {
    test('should not select a hidden focusable element', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <style>
          [hidden] {
            display: none;
          }
        </style>

        <ion-button id="open-modal">Show Modal</ion-button>
        <ion-modal trigger="open-modal">
          <ion-content>
            <ion-button hidden id="hidden">Hidden Button</ion-button>
            <ion-button id="visible">Visible Button</ion-button>
          </ion-content>
        </ion-modal>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const presentButton = page.locator('ion-button#open-modal');
      const visibleButton = page.locator('ion-button#visible');

      await presentButton.click();
      await ionModalDidPresent.next();

      await pageUtils.pressKeys('Tab');
      await expect(visibleButton).toBeFocused();

      await pageUtils.pressKeys('Tab');
      await expect(visibleButton).toBeFocused();
    });

    test('should not select a disabled focusable element', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-button id="open-modal">Show Modal</ion-button>
        <ion-modal trigger="open-modal">
          <ion-content>
            <ion-button disabled="true" id="disabled">Button</ion-button>
            <ion-button id="active">Active Button</ion-button>
          </ion-content>
        </ion-modal>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const presentButton = page.locator('ion-button#open-modal');
      const activeButton = page.locator('ion-button#active');

      await presentButton.click();
      await ionModalDidPresent.next();

      await pageUtils.pressKeys('Tab');
      await expect(activeButton).toBeFocused();

      await pageUtils.pressKeys('Tab');
      await expect(activeButton).toBeFocused();
    });

    test('should select a focusable element with disabled="false"', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <ion-button id="open-modal">Show Modal</ion-button>
        <ion-modal trigger="open-modal">
          <ion-content>
            <ion-button disabled="false" id="disabled-false">Button</ion-button>
            <ion-button id="active">Active Button</ion-button>
          </ion-content>
        </ion-modal>
      `,
        config
      );

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const presentButton = page.locator('ion-button#open-modal');
      const disabledFalseButton = page.locator('ion-button#disabled-false');
      const activeButton = page.locator('ion-button#active');

      await presentButton.click();
      await ionModalDidPresent.next();

      await pageUtils.pressKeys('Tab');
      await expect(disabledFalseButton).toBeFocused();

      await pageUtils.pressKeys('Tab');
      await expect(activeButton).toBeFocused();

      // Loop back to beginning of overlay
      await pageUtils.pressKeys('Tab');
      await expect(disabledFalseButton).toBeFocused();
    });

    test('toast should not cause focus trapping', async ({ page }) => {
      await page.goto('/src/utils/test/overlays', config);
      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

      await page.click('#create-and-present-toast');
      await ionToastDidPresent.next();

      const input = page.locator('#root-input input');
      await input.click();

      await expect(input).toBeFocused();
    });

    test('toast should not cause focus trapping even when opened from a focus trapping overlay', async ({ page }) => {
      await page.goto('/src/utils/test/overlays', config);

      const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#create-and-present');
      await ionModalDidPresent.next();

      await page.click('#modal-toast');
      await ionToastDidPresent.next();

      const modalInput = page.locator('.modal-input input');
      await modalInput.click();

      await expect(modalInput).toBeFocused();
    });

    test('focus trapping should only run on the top-most overlay', async ({ page }) => {
      await page.goto('/src/utils/test/overlays', config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#create-and-present');
      await ionModalDidPresent.next();

      const modalInputZero = page.locator('.modal-0 .modal-input input');
      await modalInputZero.click();

      await expect(modalInputZero).toBeFocused();

      await page.click('#modal-create-and-present');
      await ionModalDidPresent.next();

      const modalInputOne = page.locator('.modal-1 .modal-input input');
      await modalInputOne.click();

      await expect(modalInputOne).toBeFocused();
    });
  });

  test.describe(title('overlays: create'), () => {
    test('should not prevent scrolling on the page', async ({ page, skip }) => {
      skip.browser('webkit', 'Mouse wheel is not supported in mobile WebKit');

      await page.goto('/src/utils/test/overlays', config);

      await page.click('#create');

      const modal = page.locator('ion-modal');
      await expect(modal).toHaveCount(1);

      const contentEl = page.locator('#main-content ion-content');

      await expect(
        await contentEl.evaluate(async (el: HTMLIonContentElement) => {
          const contentScrollEl = await el.getScrollElement();
          return contentScrollEl.scrollTop;
        })
      ).toBe(0);

      await page.mouse.wheel(0, 100);

      await expect(
        await contentEl.evaluate(async (el: HTMLIonContentElement) => {
          const contentScrollEl = await el.getScrollElement();
          return contentScrollEl.scrollTop;
        })
      ).toBeGreaterThan(0);
    });
  });

  test.describe(title('overlays: present'), () => {
    test('should prevent scrolling on the page', async ({ page, skip }) => {
      skip.browser('webkit', 'Mouse wheel is not supported in mobile WebKit');
      await page.goto('/src/utils/test/overlays', config);

      await page.click('#create-and-present');

      const modal = page.locator('ion-modal');
      await expect(modal).toHaveCount(1);

      const contentEl = page.locator('#main-content ion-content');

      await expect(
        await contentEl.evaluate(async (el: HTMLIonContentElement) => {
          const contentScrollEl = await el.getScrollElement();
          return contentScrollEl.scrollTop;
        })
      ).toBe(0);

      await page.mouse.wheel(0, 100);

      await expect(
        await contentEl.evaluate(async (el: HTMLIonContentElement) => {
          const contentScrollEl = await el.getScrollElement();
          return contentScrollEl.scrollTop;
        })
      ).toBe(0);
    });
  });
});
