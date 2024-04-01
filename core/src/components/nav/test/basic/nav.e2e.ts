import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('nav: basic'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            '/src/components/nav/test/basic',
            config
          );
        }
      );

      test('should render the root component', async ({
        page,
      }) => {
        const pageOne =
          page.locator('page-one');

        await expect(
          pageOne
        ).toBeVisible();
      });

      test.describe(
        'pushing a new page',
        () => {
          test('should render the pushed component', async ({
            page,
          }) => {
            const pageTwoButton =
              page.locator(
                'ion-button:has-text("Go to Page Two")'
              );
            const pageOne =
              page.locator('page-one');
            const pageTwo =
              page.locator('page-two');

            await pageTwoButton.click();

            await page.waitForChanges();

            await expect(
              pageTwo
            ).toBeVisible();
            // Pushing a new page should hide the previous page
            await expect(
              pageOne
            ).not.toBeVisible();
          });

          test('should render the back button', async ({
            page,
          }) => {
            const pageTwoButton =
              page.locator(
                'ion-button:has-text("Go to Page Two")'
              );
            const pageTwoBackButton =
              page.locator(
                'page-two ion-back-button'
              );

            await pageTwoButton.click();
            await page.waitForChanges();

            await expect(
              pageTwoBackButton
            ).toBeVisible();
          });
        }
      );

      test('back button should pop to the previous page', async ({
        page,
      }) => {
        const pageOne =
          page.locator('page-one');
        const pageTwo =
          page.locator('page-two');
        const pageTwoButton =
          page.locator(
            'ion-button:has-text("Go to Page Two")'
          );
        const pageTwoBackButton =
          page.locator(
            'page-two ion-back-button'
          );

        await pageTwoButton.click();
        await page.waitForChanges();

        await pageTwoBackButton.click();
        await page.waitForChanges();

        await expect(
          pageOne
        ).toBeVisible();
        // Popping a page should remove it from the DOM
        await expect(
          pageTwo
        ).toHaveCount(0);
      });

      test.describe(
        'pushing multiple pages',
        () => {
          test('should keep previous pages in the DOM', async ({
            page,
          }) => {
            const pageOne =
              page.locator('page-one');
            const pageTwo =
              page.locator('page-two');
            const pageThree =
              page.locator(
                'page-three'
              );

            const pageTwoButton =
              page.locator(
                'ion-button:has-text("Go to Page Two")'
              );
            const pageThreeButton =
              page.locator(
                'ion-button:has-text("Go to Page Three")'
              );

            await pageTwoButton.click();
            await page.waitForChanges();

            await expect(
              pageOne
            ).toHaveCount(1);
            await expect(
              pageTwo
            ).toBeVisible();

            await pageThreeButton.click();
            await page.waitForChanges();

            await expect(
              pageOne
            ).toHaveCount(1);
            await expect(
              pageTwo
            ).toHaveCount(1);
            await expect(
              pageThree
            ).toBeVisible();
          });
        }
      );
    }
  );
});
