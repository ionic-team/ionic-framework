import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

import { openPopover } from '../test.utils';

/**
 * A CSS `zoom` causes geometry APIs such as `getBoundingClientRect()` and
 * pointer `clientX`/`clientY` to report values in the zoomed coordinate space,
 * while the inline `top`/`left`/`--width` styles the popover sets are
 * interpreted in the unzoomed layout space. The popover needs to account for
 * this so it stays anchored to its trigger.
 *
 * These are functional assertions rather than screenshots because what is being
 * verified is the popover's geometry relative to its trigger, not its
 * appearance. Both boxes are read in the same coordinate space, so the
 * relationship between them holds at any zoom level.
 */

/**
 * Maximum difference, in pixels, between two positions still considered
 * aligned. Generous enough for sub-pixel rounding across browsers, far tighter
 * than the error a missing zoom adjustment produces (tens of pixels).
 */
const TOLERANCE = 2;

const expectAligned = (actual: number, expected: number) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(TOLERANCE);
};

/**
 * Builds a page with a trigger and a popover, with `zoomStyles` controlling
 * where in the tree the zoom is applied. The trigger is kept near the top left
 * so the popover is never pushed onto the screen by the offscreen adjustment,
 * which would mask a positioning error.
 */
const zoomedPage = (zoomStyles: string) => `
  <style>
    ${zoomStyles}

    #trigger {
      display: block;

      width: 80px;

      margin: 20px;
      padding: 8px;
    }

    ion-popover {
      --width: 100px;
    }
  </style>

  <button id="trigger">Trigger</button>
  <ion-popover trigger="trigger">
    <ion-content class="ion-padding">Content</ion-content>
  </ion-popover>
`;

const expectAnchoredToTrigger = async (page: E2EPage) => {
  const triggerBox = (await page.locator('#trigger').boundingBox())!;
  const contentBox = (await page.locator('ion-popover').locator('.popover-content').boundingBox())!;

  expectAligned(contentBox.x, triggerBox.x);
  expectAligned(contentBox.y, triggerBox.y + triggerBox.height);
};

/**
 * This behavior does not vary across directions. MD mode is used because it has
 * no arrow offsetting the content and defaults to `start` alignment, which
 * makes the expected relationship to the trigger unambiguous.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: zoom'), () => {
    test.beforeEach(() => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30919',
      });
    });

    test.describe('zoom on the html element', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/src/components/popover/test/zoom', config);
      });

      test('should align the popover with its trigger', async ({ page }) => {
        await openPopover(page, 'auto-trigger');

        const triggerBox = (await page.locator('#auto-trigger').boundingBox())!;
        const contentBox = (await page.locator('ion-popover.auto-popover').locator('.popover-content').boundingBox())!;

        expectAligned(contentBox.x, triggerBox.x);
        expectAligned(contentBox.y, triggerBox.y + triggerBox.height);
      });

      test('should not render the popover offscreen', async ({ page }) => {
        await openPopover(page, 'edge-trigger');

        const viewport = page.viewportSize()!;
        const contentBox = (await page.locator('ion-popover.edge-popover').locator('.popover-content').boundingBox())!;

        expect(contentBox.x).toBeGreaterThanOrEqual(0);
        expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(viewport.width);
      });

      test('should match the trigger width when size is cover', async ({ page }) => {
        await openPopover(page, 'cover-trigger');

        const triggerBox = (await page.locator('#cover-trigger').boundingBox())!;
        const contentBox = (await page.locator('ion-popover.cover-popover').locator('.popover-content').boundingBox())!;

        expectAligned(contentBox.width, triggerBox.width);
      });
    });

    /**
     * The zoom must be read from the popover's own context rather than from
     * `document.documentElement`, otherwise a zoom applied lower in the tree is
     * missed entirely.
     */
    test.describe('zoom applied at other levels of the tree', () => {
      test('should align the popover when zoom is on the body', async ({ page }) => {
        await page.setContent(zoomedPage('body { zoom: 1.5; }'), config);
        await openPopover(page, 'trigger');

        await expectAnchoredToTrigger(page);
      });

      test('should align the popover when zoom accumulates across ancestors', async ({ page }) => {
        await page.setContent(zoomedPage('html { zoom: 1.2; } body { zoom: 1.25; }'), config);
        await openPopover(page, 'trigger');

        await expectAnchoredToTrigger(page);
      });

      test('should align the popover when the page is zoomed out', async ({ page }) => {
        await page.setContent(zoomedPage('html { zoom: 0.8; }'), config);
        await openPopover(page, 'trigger');

        await expectAnchoredToTrigger(page);
      });
    });

    /**
     * `reference="event"` positions the popover from the pointer coordinates of
     * the event, which are reported in the zoomed coordinate space too.
     */
    test.describe('pointer coordinates', () => {
      test('should position the popover at the pointer when reference is event', async ({ page }) => {
        await page.setContent(
          zoomedPage('html { zoom: 1.5; }').replace('trigger="trigger"', 'trigger="trigger" reference="event"'),
          config
        );

        const triggerBox = (await page.locator('#trigger').boundingBox())!;
        await openPopover(page, 'trigger');

        const contentBox = (await page.locator('ion-popover').locator('.popover-content').boundingBox())!;

        /**
         * Playwright clicks the centre of the trigger, which is where the
         * popover should be anchored.
         */
        expectAligned(contentBox.x, triggerBox.x + triggerBox.width / 2);
        expectAligned(contentBox.y, triggerBox.y + triggerBox.height / 2);
      });
    });
  });
});

/**
 * The arrow only exists in ios mode.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: zoom'), () => {
    test('should centre the arrow on the trigger when a zoom is applied', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30919',
      });

      await page.setContent(zoomedPage('html { zoom: 1.5; }'), config);
      await openPopover(page, 'trigger');

      const triggerBox = (await page.locator('#trigger').boundingBox())!;
      const arrowBox = (await page.locator('ion-popover').locator('.popover-arrow').boundingBox())!;

      expectAligned(arrowBox.x + arrowBox.width / 2, triggerBox.x + triggerBox.width / 2);
    });
  });
});
