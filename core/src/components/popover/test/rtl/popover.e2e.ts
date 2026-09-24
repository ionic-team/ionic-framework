import { expect } from '@playwright/test';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { configs, test, Viewports } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: rtl ancestor'), () => {
    const openStartSidePopover = async (page: E2EPage, config: E2EPageOptions, appDir: string) => {
      await page.setViewportSize(Viewports.tablet.portrait);
      await page.setContent(
        `
        <ion-app${appDir ? ` dir="${appDir}"` : ''}>
          <ion-content>
            <div style="display: flex; justify-content: center; padding-top: 150px;">
              <ion-button id="trigger">Open</ion-button>
            </div>
            <ion-popover trigger="trigger" reference="trigger" side="start" alignment="center">
              <ion-content>Popover</ion-content>
            </ion-popover>
          </ion-content>
        </ion-app>
      `,
        config
      );

      await openPopover(page, 'trigger');

      const content = page.locator('ion-popover .popover-content');

      return {
        trigger: (await page.locator('#trigger').boundingBox())!,
        content: (await content.boundingBox())!,
        originX: (await content.evaluate((el) => getComputedStyle(el).transformOrigin)).split(' ')[0],
      };
    };

    test('should place a start side popover before the trigger in an ltr app', async ({ page }) => {
      const { trigger, content, originX } = await openStartSidePopover(page, config, 'ltr');

      expect(content.x + content.width).toBeLessThanOrEqual(trigger.x);
      expect(originX).toBe(`${content.width}px`);
    });

    test('should place a start side popover after the trigger when the app declares rtl', async ({ page }) => {
      const { trigger, content, originX } = await openStartSidePopover(page, config, 'rtl');

      expect(content.x).toBeGreaterThanOrEqual(trigger.x + trigger.width);
      expect(originX).toBe('0px');
    });
  });
});
