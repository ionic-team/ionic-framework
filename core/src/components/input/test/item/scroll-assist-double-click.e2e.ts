import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: scroll assist click events'), () => {
    test.beforeEach((_, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30412',
      });
    });

    const setup = async (page: E2EPage) => {
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(40);
      await page.setContent(
        `
        <ion-app>
          <ion-content>
            <p style="padding: 16px;">${longText}</p>
            <ion-item id="target">
              <ion-input value="George"></ion-input>
            </ion-item>
            <p style="padding: 16px;">${longText}</p>
          </ion-content>
        </ion-app>
        `,
        config
      );
    };

    // Position the target near the bottom of the viewport so scroll assist's
    // `scrollAmount` calculation passes its 4px threshold and the relocate path runs.
    const positionTargetForScrollAssist = async (page: E2EPage) => {
      await page.evaluate(async () => {
        const content = document.querySelector('ion-content') as HTMLIonContentElement;
        const item = document.querySelector('#target')!;
        const scrollEl = await content.getScrollElement();
        const itemRect = item.getBoundingClientRect();
        const desiredTop = window.innerHeight - itemRect.height - 20;
        scrollEl.scrollTop += itemRect.top - desiredTop;
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      });
    };

    // Two rAF cycles drain any rAF-scheduled work, including the legacy recovery
    // click that scroll assist used to fire after relocating the input.
    const flushAnimationFrames = (page: E2EPage) =>
      page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
      );

    test('clicking ion-item padding when scroll is needed should fire one click event', async ({ page }) => {
      await setup(page);
      await positionTargetForScrollAssist(page);

      const item = page.locator('#target');
      const onClick = await page.spyOnEvent('click');

      // `force: true` skips Playwright's auto-scroll-into-view, so the click
      // lands while the item still requires scroll assist to relocate.
      await item.click({ position: { x: 5, y: 5 }, force: true });
      await flushAnimationFrames(page);

      expect(onClick).toHaveReceivedEventTimes(1);
    });

    test('clicking ion-input directly when scroll is needed should fire one click event', async ({ page }) => {
      await setup(page);
      await positionTargetForScrollAssist(page);

      const onClick = await page.spyOnEvent('click');
      const nativeInput = page.locator('#target ion-input input');
      await nativeInput.click({ force: true });
      await flushAnimationFrames(page);

      expect(onClick).toHaveReceivedEventTimes(1);
    });

    test('programmatic setFocus when scroll is needed should not fire a click event', async ({ page }) => {
      await setup(page);
      await positionTargetForScrollAssist(page);

      const onClick = await page.spyOnEvent('click');
      await page.evaluate(async () => {
        const input = document.querySelector('#target ion-input') as HTMLIonInputElement;
        await input.setFocus();
      });
      await flushAnimationFrames(page);

      expect(onClick).toHaveReceivedEventTimes(0);
    });

    test('keyboard focus into input when scroll is needed should not fire a click event', async ({ page }) => {
      await setup(page);
      await positionTargetForScrollAssist(page);

      const onClick = await page.spyOnEvent('click');

      // Focus the native input directly without dispatching a click; mimics
      // tab navigation landing on an offscreen input.
      await page.evaluate(() => {
        const native = document.querySelector('#target ion-input input') as HTMLInputElement;
        native.focus();
      });
      await flushAnimationFrames(page);

      expect(onClick).toHaveReceivedEventTimes(0);
    });
  });
});
