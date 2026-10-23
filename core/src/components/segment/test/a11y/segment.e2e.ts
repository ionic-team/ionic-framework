import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Only md mode uses ion-color() for the segment button
 */
configs({ directions: ['ltr'], modes: ['md'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('segment: a11y for ion-color()'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-segment aria-label="Tab Options" value="bookmarks">
            <ion-segment-button value="bookmarks">
              <ion-label>Bookmarks</ion-label>
            </ion-segment-button>
            <ion-segment-button value="reading-list">
              <ion-label>Reading List</ion-label>
            </ion-segment-button>
          </ion-segment>
        </main>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});

configs().forEach(({ title, config }) => {
  test.describe(title('segment: a11y'), () => {
    test('should not have any axe violations', async ({ page }) => {
      await page.goto('/src/components/segment/test/a11y', config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('should enter the selected button and leave the segment with Tab', async ({ page, pageUtils }) => {
      await page.setContent(
        `<button id="before">Before</button>
         <ion-segment value="second">
           <ion-segment-button value="first">First</ion-segment-button>
           <ion-segment-button value="second">Second</ion-segment-button>
           <ion-segment-button value="third">Third</ion-segment-button>
         </ion-segment>
         <button id="after">After</button>`,
        config
      );
      const buttons = page.locator('ion-segment-button');
      await page.locator('#before').focus();
      await pageUtils.pressKeys('Tab');
      await expect(buttons.nth(1)).toBeFocused();
      await pageUtils.pressKeys('Tab');
      await expect(page.locator('#after')).toBeFocused();
      await pageUtils.pressKeys('Shift+Tab');
      await expect(buttons.nth(1)).toBeFocused();

      // Manual activation moves focus without changing the selected button.
      await page.keyboard.press('Home');
      await expect(buttons.nth(0)).toBeFocused();
      await expect(buttons.nth(1).locator('button')).toHaveAttribute('aria-selected', 'true');
      await pageUtils.pressKeys('Tab');
      await expect(page.locator('#after')).toBeFocused();
      await pageUtils.pressKeys('Shift+Tab');
      await expect(buttons.nth(1)).toBeFocused();
      await page.keyboard.press('End');
      await expect(buttons.nth(2)).toBeFocused();
      await pageUtils.pressKeys('Shift+Tab');
      await expect(page.locator('#before')).toBeFocused();
    });

    test('should keep one enabled tab stop when buttons change', async ({ page }) => {
      await page.setContent(
        `<ion-segment value="second">
           <ion-segment-button value="first" disabled>First</ion-segment-button>
           <ion-segment-button value="second">Second</ion-segment-button>
           <ion-segment-button value="third">Third</ion-segment-button>
         </ion-segment>`,
        config
      );
      const tabStop = page.locator('ion-segment-button button[tabindex="0"]');
      await expect(tabStop).toHaveCount(1);
      await expect(tabStop).toHaveAccessibleName('Second');
      await page.locator('ion-segment-button[value="second"]').evaluate((button: HTMLIonSegmentButtonElement) => {
        button.disabled = true;
      });
      await expect(tabStop).toHaveCount(1);
      await expect(tabStop).toHaveAccessibleName('Third');
      await page.locator('ion-segment-button[value="first"]').evaluate((button: HTMLIonSegmentButtonElement) => {
        button.disabled = false;
      });
      await expect(tabStop).toHaveCount(1);
      await expect(tabStop).toHaveAccessibleName('First');
      await page.locator('ion-segment').evaluate((segment: HTMLIonSegmentElement) => {
        segment.value = 'third';
      });
      await expect(tabStop).toHaveAccessibleName('Third');
      await page.locator('ion-segment-button[value="third"]').evaluate((button) => button.remove());
      await expect(tabStop).toHaveCount(1);
      await expect(tabStop).toHaveAccessibleName('First');
      await page.locator('ion-segment').evaluate((segment: HTMLIonSegmentElement) => {
        segment.value = 'added';
        const button = document.createElement('ion-segment-button');
        button.value = 'added';
        button.textContent = 'Added';
        segment.append(button);
      });
      await expect(tabStop).toHaveCount(1);
      await expect(tabStop).toHaveAccessibleName('Added');
      await page.locator('ion-segment-button[value="first"] button').focus();
      await expect(tabStop).toHaveAccessibleName('First');
      await page.locator('ion-segment').evaluate((segment) => {
        segment.remove();
        document.body.append(segment);
      });
      await expect(tabStop).toHaveCount(1);
      await expect(tabStop).toHaveAccessibleName('Added');
    });

    test('segment buttons should be keyboard navigable', async ({ page, pageUtils }) => {
      const isRTL = config.direction === 'rtl';
      const nextKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
      const previousKey = isRTL ? 'ArrowRight' : 'ArrowLeft';

      await page.goto('/src/components/segment/test/a11y', config);

      const segmentButtons = page.locator('ion-segment-button');

      // A flaky test only occurs on "Mobile Chrome"
      // If it occurs, the elements are not visible yet
      // when the test presses the any key on the keyboard
      // This may be due to the fact that the elements are
      // still updating their state before the render method
      // The workaround is to wait for the first element to be visible
      // If the first element is visible, then the rest of the elements are visible
      await segmentButtons.nth(0).waitFor();

      await pageUtils.pressKeys('Tab');
      await expect(segmentButtons.nth(0)).toBeFocused();

      await page.keyboard.press(nextKey);
      await expect(segmentButtons.nth(1)).toBeFocused();

      await page.keyboard.press(previousKey);
      await expect(segmentButtons.nth(0)).toBeFocused();

      await page.keyboard.press('End');
      await expect(segmentButtons.nth(2)).toBeFocused();

      await page.keyboard.press('Home');
      await expect(segmentButtons.nth(0)).toBeFocused();

      // Loop to the end from the start
      await page.keyboard.press(previousKey);
      await expect(segmentButtons.nth(2)).toBeFocused();

      // Loop to the start from the end
      await page.keyboard.press(nextKey);
      await expect(segmentButtons.nth(0)).toBeFocused();
    });
  });
});
