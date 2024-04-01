import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(
  ({ title, config, screenshot }) => {
    test.describe(
      title('menu: safe area'),
      () => {
        test.beforeEach(
          async ({ page }) => {
            await page.goto(
              `/src/components/menu/test/safe-area`,
              config
            );
          }
        );
        test.describe(
          'side: start',
          () => {
            test('should render with safe area when notch is on the left', async ({
              page,
            }) => {
              const ionDidOpen =
                await page.spyOnEvent(
                  'ionDidOpen'
                );

              await page.evaluate(
                () => {
                  const style =
                    document.querySelector(
                      'style'
                    );
                  style!.innerHTML = `
            :root {
              --ion-safe-area-left: 50px !important;
              --ion-safe-area-right: 10px !important;
            }
          `;
                }
              );

              await page.click(
                '#open-start'
              );
              await ionDidOpen.next();

              const startMenu =
                page.locator(
                  '[menu-id="start-menu"]'
                );
              await expect(
                startMenu
              ).toHaveClass(
                /show-menu/
              );

              await expect(
                page
              ).toHaveScreenshot(
                screenshot(
                  `menu-start-safe-area-left-notch`
                )
              );
            });
            test('should render with safe area when notch is on the right', async ({
              page,
            }) => {
              const ionDidOpen =
                await page.spyOnEvent(
                  'ionDidOpen'
                );

              await page.evaluate(
                () => {
                  const style =
                    document.querySelector(
                      'style'
                    );
                  style!.innerHTML = `
            :root {
              --ion-safe-area-left: 10px !important;
              --ion-safe-area-right: 50px !important;
            }
          `;
                }
              );

              await page.click(
                '#open-start'
              );
              await ionDidOpen.next();

              const startMenu =
                page.locator(
                  '[menu-id="start-menu"]'
                );
              await expect(
                startMenu
              ).toHaveClass(
                /show-menu/
              );

              await expect(
                page
              ).toHaveScreenshot(
                screenshot(
                  `menu-start-safe-area-right-notch`
                )
              );
            });
          }
        );
        test.describe(
          'side: end',
          () => {
            test('should render with safe area when notch is on the left', async ({
              page,
            }) => {
              const ionDidOpen =
                await page.spyOnEvent(
                  'ionDidOpen'
                );

              await page.evaluate(
                () => {
                  const style =
                    document.querySelector(
                      'style'
                    );
                  style!.innerHTML = `
            :root {
              --ion-safe-area-left: 50px !important;
              --ion-safe-area-right: 10px !important;
            }
          `;
                }
              );

              await page.click(
                '#open-end'
              );
              await ionDidOpen.next();

              const endMenu =
                page.locator(
                  '[menu-id="end-menu"]'
                );
              await expect(
                endMenu
              ).toHaveClass(
                /show-menu/
              );

              await expect(
                page
              ).toHaveScreenshot(
                screenshot(
                  `menu-end-safe-area-left-notch`
                )
              );
            });
            test('should render with safe area when notch is on the right', async ({
              page,
            }) => {
              const ionDidOpen =
                await page.spyOnEvent(
                  'ionDidOpen'
                );

              await page.evaluate(
                () => {
                  const style =
                    document.querySelector(
                      'style'
                    );
                  style!.innerHTML = `
            :root {
              --ion-safe-area-left: 10px !important;
              --ion-safe-area-right: 50px !important;
            }
          `;
                }
              );

              await page.click(
                '#open-end'
              );
              await ionDidOpen.next();

              const endMenu =
                page.locator(
                  '[menu-id="end-menu"]'
                );
              await expect(
                endMenu
              ).toHaveClass(
                /show-menu/
              );

              await expect(
                page
              ).toHaveScreenshot(
                screenshot(
                  `menu-end-safe-area-right-notch`
                )
              );
            });
          }
        );
      }
    );
  }
);
