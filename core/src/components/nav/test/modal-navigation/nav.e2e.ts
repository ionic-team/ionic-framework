import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
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
    title('nav: modal-navigation'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            `/src/components/nav/test/modal-navigation`,
            config
          );
          await openModal(page);
        }
      );

      test('should render the root page', async ({
        page,
      }) => {
        const pageOne =
          page.locator('page-one');
        const pageOneHeading =
          page.locator('page-one h1');

        await expect(
          pageOne
        ).toBeVisible();
        await expect(
          pageOneHeading
        ).toHaveText('Page One');
      });

      test('should push to the next page', async ({
        page,
      }) => {
        await page.click(
          '#goto-page-two'
        );

        const pageTwo =
          page.locator('page-two');
        const pageTwoHeading =
          page.locator('page-two h1');

        await expect(
          pageTwo
        ).toBeVisible();
        await expect(
          pageTwoHeading
        ).toHaveText('Page Two');
      });

      test('should pop to the previous page', async ({
        page,
      }) => {
        await page.click(
          '#goto-page-two'
        );
        await page.click(
          '#goto-page-three'
        );

        const pageThree = page.locator(
          'page-three'
        );
        const pageThreeHeading =
          page.locator('page-three h1');

        await expect(
          pageThree
        ).toBeVisible();
        await expect(
          pageThreeHeading
        ).toHaveText('Page Three');

        await page.click('#go-back');

        const pageTwo =
          page.locator('page-two');
        const pageTwoHeading =
          page.locator('page-two h1');

        // Verifies the leavingView was unmounted
        await expect(
          pageThree
        ).toHaveCount(0);
        await expect(
          pageTwo
        ).toBeVisible();
        await expect(
          pageTwoHeading
        ).toHaveText('Page Two');
      });

      test.describe(
        'popping to the root',
        () => {
          test('should render the root page', async ({
            page,
          }) => {
            const pageTwo =
              page.locator('page-two');
            const pageThree =
              page.locator(
                'page-three'
              );

            await page.click(
              '#goto-page-two'
            );
            await page.click(
              '#goto-page-three'
            );

            await page.click(
              '#goto-root'
            );

            const pageOne =
              page.locator('page-one');
            const pageOneHeading =
              page.locator(
                'page-one h1'
              );

            // Verifies all views besides the root were unmounted
            await expect(
              pageTwo
            ).toHaveCount(0);
            await expect(
              pageThree
            ).toHaveCount(0);

            await expect(
              pageOne
            ).toBeVisible();
            await expect(
              pageOneHeading
            ).toHaveText('Page One');
          });
        }
      );
    }
  );
});

const openModal = async (
  page: E2EPage
) => {
  const ionModalDidPresent =
    await page.spyOnEvent(
      'ionModalDidPresent'
    );
  await page.click('#openModal');
  await ionModalDidPresent.next();
};
