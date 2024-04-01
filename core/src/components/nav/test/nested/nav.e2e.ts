import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

// Tests for ion-nav used in ion-router

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('nav: nested'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/nav/test/nested',
            config
          );
        }
      );

      test('should push pages with nested ion-nav', async ({
        page,
      }) => {
        const pageOne =
          page.locator('page-one');
        const pageTwo =
          page.locator('page-two');

        const pageTwoButton =
          page.locator(
            'ion-button:has-text("Go to Page 2")'
          );
        const pageTwoTwoButton =
          page.locator(
            'ion-button:has-text("Go to Page 2.2")'
          );

        await pageTwoButton.click();
        await page.waitForChanges();

        const pageTwoOne = page.locator(
          'page-two-one'
        );
        const pageTwoTwo = page.locator(
          'page-two-two'
        );

        await expect(
          pageOne
        ).toHaveCount(1);
        await expect(
          pageTwo
        ).toBeVisible();
        await expect(
          pageTwoOne
        ).toBeVisible();

        await pageTwoTwoButton.click();
        await page.waitForChanges();

        await expect(
          pageTwoOne
        ).toHaveCount(1);
        await expect(
          pageTwoTwo
        ).toBeVisible();

        const pageThreeButton =
          page.locator(
            'ion-button:has-text("Go to Page 3")'
          );

        await pageThreeButton.click();
        await page.waitForChanges();

        const pageThree = page.locator(
          'page-three'
        );

        await expect(
          pageThree
        ).toBeVisible();
        await expect(
          pageTwo
        ).toHaveCount(1);
        await expect(
          pageOne
        ).toHaveCount(1);
      });

      test.describe(
        'back button',
        () => {
          test('should work with nested ion-nav', async ({
            page,
          }) => {
            const pageTwoButton =
              page.locator(
                'ion-button:has-text("Go to Page 2")'
              );
            const pageTwoTwoButton =
              page.locator(
                'ion-button:has-text("Go to Page 2.2")'
              );

            await pageTwoButton.click();
            await page.waitForChanges();

            const pageTwoOne =
              page.locator(
                'page-two-one'
              );
            const pageTwoTwo =
              page.locator(
                'page-two-two'
              );

            await pageTwoTwoButton.click();
            await page.waitForChanges();

            const pageThreeButton =
              page.locator(
                'ion-button:has-text("Go to Page 3")'
              );
            const pageThreeBackButton =
              page.locator(
                'page-three ion-back-button'
              );

            await pageThreeButton.click();
            await page.waitForChanges();

            const pageThree =
              page.locator(
                'page-three'
              );

            await pageThreeBackButton.click();
            await page.waitForChanges();

            await expect(
              pageThree
            ).toHaveCount(0);
            await expect(
              pageTwoTwo
            ).toBeVisible();

            const pageTwoTwoBackButton =
              page.locator(
                'page-two-two ion-back-button'
              );

            await pageTwoTwoBackButton.click();
            await page.waitForChanges();

            await expect(
              pageTwoTwo
            ).toHaveCount(0);
            await expect(
              pageTwoOne
            ).toBeVisible();
          });
        }
      );
    }
  );
});
