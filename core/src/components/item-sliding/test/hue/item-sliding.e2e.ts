import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('item-option: hue'), () => {
    test('should render subtle item options', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Default Color
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option>Default</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>

          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Core Colors
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option color="primary">Primary</ion-item-option>
              <ion-item-option color="secondary">Secondary</ion-item-option>
              <ion-item-option color="tertiary">Tertiary</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>

          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Status Colors
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option color="success">Success</ion-item-option>
              <ion-item-option color="warning">Warning</ion-item-option>
              <ion-item-option color="danger">Danger</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>

          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Neutral Colors
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option color="light">Light</ion-item-option>
              <ion-item-option color="medium">Medium</ion-item-option>
              <ion-item-option color="dark">Dark</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      `,
        config
      );

      // Wait for web components to hydrate
      await page.waitForFunction(() => customElements.get('ion-item-sliding') !== undefined);

      await page.evaluate(() => {
        const items = document.querySelectorAll('ion-item-sliding');
        items.forEach((item: any) => item.open('start'));
      });

      // Wait for options to be visible
      await page.waitForTimeout(500);

      await expect(page.locator('ion-list')).toHaveScreenshot(screenshot('item-option-hue-subtle'));
    });

    test('should render bold item options', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Default Color
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option hue="bold">Default</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>

          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Core Colors
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option hue="bold" color="primary">Primary</ion-item-option>
              <ion-item-option hue="bold" color="secondary">Secondary</ion-item-option>
              <ion-item-option hue="bold" color="tertiary">Tertiary</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>

          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Status Colors
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option hue="bold" color="success">Success</ion-item-option>
              <ion-item-option hue="bold" color="warning">Warning</ion-item-option>
              <ion-item-option hue="bold" color="danger">Danger</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>

          <ion-item-sliding>
            <ion-item>
              <ion-label>
                Neutral Colors
              </ion-label>
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option hue="bold" color="light">Light</ion-item-option>
              <ion-item-option hue="bold" color="medium">Medium</ion-item-option>
              <ion-item-option hue="bold" color="dark">Dark</ion-item-option>
            </ion-item-options>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      `,
        config
      );

      // Wait for web components to hydrate
      await page.waitForFunction(() => customElements.get('ion-item-sliding') !== undefined);

      await page.evaluate(() => {
        const items = document.querySelectorAll('ion-item-sliding');
        items.forEach((item: any) => item.open('start'));
      });

      // Wait for options to be visible
      await page.waitForTimeout(500);

      await expect(page.locator('ion-list')).toHaveScreenshot(screenshot('item-option-hue-bold'));
    });
  });
});
