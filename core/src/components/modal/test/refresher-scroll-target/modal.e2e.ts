import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, dragElementByYAxis, test } from '@utils/test/playwright';

const dragDownOnScrollHost = async (page: E2EPage, dragByY = 250) => {
  // The refresher creates its gesture asynchronously, so wait for it to hydrate.
  await page.locator('ion-modal ion-refresher.hydrated').waitFor({ state: 'attached' });

  const scrollHost = page.locator('ion-modal .ion-content-scroll-host');
  const box = (await scrollHost.boundingBox())!;

  // Start near the top of the host so the drag stays within smaller viewports.
  await dragElementByYAxis(scrollHost, page, dragByY, box.y + 5);
};

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('sheet modal: refresher with custom scroll target'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/refresher-scroll-target', config);
    });

    test('should refresh instead of dismissing when pulling down on the custom scroll target', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31332',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionRefresh = await page.spyOnEvent('ionRefresh');

      await page.click('#sheet');
      await ionModalDidPresent.next();

      await dragDownOnScrollHost(page);

      await ionRefresh.next();
      expect(ionModalDidDismiss).toHaveReceivedEventTimes(0);
    });

    test('should refresh instead of dismissing when expandToScroll is disabled', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31332',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionRefresh = await page.spyOnEvent('ionRefresh');

      await page.click('#sheet-no-expand');
      await ionModalDidPresent.next();

      await dragDownOnScrollHost(page);

      await ionRefresh.next();
      expect(ionModalDidDismiss).toHaveReceivedEventTimes(0);
    });

    test('should move the sheet rather than refresh when dragging the content at a partial breakpoint', async ({
      page,
    }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const ionRefresh = await page.spyOnEvent('ionRefresh');

      await page.click('#sheet-breakpoints');
      await ionModalDidPresent.next();

      await dragDownOnScrollHost(page);

      await ionBreakpointDidChange.next();
      expect(ionRefresh).toHaveReceivedEventTimes(0);
    });

    test('should refresh rather than move the sheet at a partial breakpoint when expandToScroll is disabled', async ({
      page,
    }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const ionRefresh = await page.spyOnEvent('ionRefresh');

      await page.click('#sheet-breakpoints-no-expand');
      await ionModalDidPresent.next();

      await dragDownOnScrollHost(page);

      await ionRefresh.next();
      expect(ionBreakpointDidChange).toHaveReceivedEventTimes(0);
    });

    test('should keep the content opted out of scrolling after the sheet snaps back', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31332',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const ionRefresh = await page.spyOnEvent('ionRefresh');

      await page.click('#sheet-breakpoints');
      await ionModalDidPresent.next();

      const content = page.locator('ion-modal ion-content');
      await expect(content).toHaveJSProperty('scrollY', false);

      /**
       * Expanding to the top breakpoint is what used to force scrolling back on.
       * Waiting on the breakpoint change also proves the drag moved the sheet, so
       * this cannot pass by leaving the content untouched.
       */
      const wrapper = (await page.locator('ion-modal .modal-wrapper').boundingBox())!;
      await dragElementByYAxis(page.locator('ion-modal .modal-handle'), page, -Math.round(wrapper.height * 0.3));
      await ionBreakpointDidChange.next();

      await expect(content).toHaveJSProperty('scrollY', false);

      await dragDownOnScrollHost(page);

      await ionRefresh.next();
    });

    test('should keep the content opted out of scrolling when expandToScroll is disabled', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-breakpoints-no-expand');
      await ionModalDidPresent.next();

      const content = page.locator('ion-modal ion-content');
      await expect(content).toHaveJSProperty('scrollY', false);

      // With expandToScroll disabled the sheet restores scrolling at every breakpoint.
      await dragElementByYAxis(page.locator('ion-modal .modal-handle'), page, 60);

      await expect(content).toHaveJSProperty('scrollY', false);
    });

    test('should still dismiss when dragging the handle', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#sheet-no-expand');
      await ionModalDidPresent.next();

      await dragElementByYAxis(page.locator('ion-modal .modal-handle'), page, 500);

      await ionModalDidDismiss.next();
    });
  });
});

/**
 * Card modals are only available in iOS mode.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('card modal: refresher with custom scroll target'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/refresher-scroll-target', config);
    });

    test('should refresh instead of dismissing when pulling down on the custom scroll target', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31332',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionRefresh = await page.spyOnEvent('ionRefresh');

      await page.click('#card');
      await ionModalDidPresent.next();

      await dragDownOnScrollHost(page);

      await ionRefresh.next();
      expect(ionModalDidDismiss).toHaveReceivedEventTimes(0);
    });
  });
});
