import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * item-sliding doesn't have mode-specific styling,
 * but the child components, item-options and item-option, do.
 *
 * It is important to test all modes to ensure that the
 * child components are being rendered correctly.
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/basic`, config);
    });
    test.describe('start options', () => {
      test('should not have visual regressions', async ({ page }) => {
        const item = page.locator('#item2');

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         * Positive dragByX value to drag element from the left to the right
         * to reveal the options on the left side.
         */
        const dragByX = config.direction === 'rtl' ? -150 : 150;

        await dragElementBy(item, page, dragByX);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot('item-sliding-start'));
      });
    });

    test.describe('end options', () => {
      test('should not have visual regressions', async ({ page }) => {
        const item = page.locator('#item2');

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         * Positive dragByX value to drag element from the left to the right
         * to reveal the options on the left side.
         */
        const dragByX = config.direction === 'rtl' ? 150 : -150;

        await dragElementBy(item, page, dragByX);

        await expect(item).toHaveScreenshot(screenshot('item-sliding-end'));
      });
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: basic'), () => {
    test('should open when swiped', async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/basic`, config);
      const item = page.locator('#item2');

      await dragElementBy(item, page, -150);
      await page.waitForChanges();

      // item-sliding doesn't have an easy way to tell whether it's fully open so just screenshot it
      await expect(item).toHaveScreenshot(screenshot(`item-sliding-gesture`));
    });

    test.only('the dynamic element should be clicked', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28662',
      });

      await page.setContent(
        `
        <ion-list>
          <ion-item-sliding>
            <ion-item>
              <ion-label>Item</ion-label>
            </ion-item>

            <ion-item-options>
              <ion-item-option>ARCHIVE</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>

        <ion-button id="add-element-btn" onclick="addElement()">Add element</ion-button>
        <script>
          function addElement() {
            const itemSliding = document.querySelector('ion-item-sliding');

            // Define and create the elements to add on DOM
            const itemOptions = document.querySelector('ion-item-options');
            const newIonItemOption = document.createElement('ion-item-option');

            newIonItemOption.innerText = 'DELETE';
            newIonItemOption.id = 'element-added-delete';

            itemOptions.appendChild(newIonItemOption);

            // Close the item-sliding to update the values
            itemSliding.close();

            // Make async call of the open method of item-sliding
            setTimeout(function () {
              itemSliding.open();
            }, 0);
          }
        </script>
      `,
        config
      );

      const itemSliding = page.locator('ion-item-sliding');
      await dragElementBy(itemSliding, page, -150);

      // Trigger the button to add the dynamic content
      const button = page.locator('#add-element-btn');
      await button.click();

      // Check if the element added is clicked
      const elementAdded = page.locator('#element-added-delete');

      // If the element is not clickable then this will timeout
      await elementAdded.click();
    });

    test('should not scroll when the item-sliding is swiped', async ({ page, skip }) => {
      skip.browser('webkit', 'mouse.wheel is not available in WebKit');

      await page.goto(`/src/components/item-sliding/test/basic`, config);

      const itemSlidingEl = page.locator('#item2');
      const scrollEl = page.locator('ion-content .inner-scroll');

      expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);

      const box = (await itemSlidingEl.boundingBox())!;
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX - 30, centerY);

      /**
       * Do not use scrollToBottom() or other scrolling methods
       * on ion-content as those will update the scroll position.
       * Setting scrollTop still works even with overflow-y: hidden.
       * However, simulating a user gesture should not scroll the content.
       */
      await page.mouse.wheel(0, 100);
      await page.waitForChanges();

      expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);
    });
  });
});

/**
 * This behavior needs to be tested in both modes and directions to
 * make sure the safe area padding is applied only to that side
 * regardless of direction
 */
configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: basic'), () => {
    test.describe('safe area left', () => {
      test('should have padding on the left only', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-safe-area-left: 40px;
            }
          </style>

          <ion-item-sliding>
            <ion-item-options side="start">
              <ion-item-option color="primary">
                Archive
              </ion-item-option>
              <ion-item-option color="danger">
                Delete
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-label>
                Sliding Item
              </ion-label>
            </ion-item>
          </ion-item-sliding>
        `,
          config
        );

        const direction = config.direction;
        const item = page.locator('ion-item-sliding');

        const dragByX = direction == 'rtl' ? -150 : 150;
        await dragElementBy(item, page, dragByX);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot(`item-sliding-safe-area-left`));
      });
    });

    test.describe('safe area right', () => {
      test('should have padding on the right only', async ({ page }) => {
        await page.setContent(
          `
          <style>
            :root {
              --ion-safe-area-right: 40px;
            }
          </style>

          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Sliding Item
              </ion-label>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option color="primary">
                Archive
              </ion-item-option>
              <ion-item-option color="danger">
                Delete
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        `,
          config
        );

        const direction = config.direction;
        const item = page.locator('ion-item-sliding');

        const dragByX = direction == 'rtl' ? 150 : -150;
        await dragElementBy(item, page, dragByX);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot(`item-sliding-safe-area-right`));
      });
    });
  });
});
