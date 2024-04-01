import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(
  ({ config, screenshot, title }) => {
    test.describe(
      title('breadcrumbs: reactive'),
      () => {
        test.beforeEach(
          async ({ page }) => {
            await page.goto(
              `/src/components/breadcrumbs/test/reactive`,
              config
            );
          }
        );

        test.describe(
          'adding a breadcrumb item',
          () => {
            test('should update the active item', async ({
              page,
            }) => {
              const breadcrumbItems =
                page.locator(
                  'ion-breadcrumb'
                );

              const addItemButton =
                page.locator(
                  'ion-button#add-btn'
                );

              await expect(
                breadcrumbItems
              ).toHaveCount(4);

              await addItemButton.click();
              await page.waitForChanges();

              await expect(
                breadcrumbItems
              ).toHaveCount(5);

              const previousActiveItem =
                breadcrumbItems.nth(3);
              const lastBreadcrumbItem =
                breadcrumbItems.nth(4);

              await expect(
                previousActiveItem
              ).not.toHaveClass(
                /breadcrumb-active/
              );
              await expect(
                lastBreadcrumbItem
              ).toHaveClass(
                /breadcrumb-active/
              );
            });

            test('should not have visual regressions', async ({
              page,
            }) => {
              await page.setIonViewport();

              const breadcrumbs =
                page.locator(
                  'ion-breadcrumbs'
                );

              await page.click(
                '#add-btn'
              );
              await page.waitForChanges();

              await expect(
                breadcrumbs
              ).toHaveScreenshot(
                screenshot(
                  `breadcrumbs-reactive-add-diff`
                )
              );
            });
          }
        );

        test.describe(
          'removing a breadcrumb item',
          () => {
            test('should update the active item', async ({
              page,
            }) => {
              const breadcrumbItems =
                page.locator(
                  'ion-breadcrumb'
                );

              await expect(
                breadcrumbItems
              ).toHaveCount(4);

              await page.click(
                '#remove-btn'
              );
              await page.waitForChanges();

              await expect(
                breadcrumbItems
              ).toHaveCount(3);

              const lastBreadcrumbItem =
                breadcrumbItems.nth(2);

              await expect(
                lastBreadcrumbItem
              ).toHaveClass(
                /breadcrumb-active/
              );
            });

            test('should not have visual regressions', async ({
              page,
            }) => {
              await page.setIonViewport();

              const breadcrumbs =
                page.locator(
                  'ion-breadcrumbs'
                );

              await page.click(
                '#remove-btn'
              );
              await page.waitForChanges();

              await expect(
                breadcrumbs
              ).toHaveScreenshot(
                screenshot(
                  `breadcrumbs-reactive-remove-diff`
                )
              );
            });
          }
        );
      }
    );
  }
);
