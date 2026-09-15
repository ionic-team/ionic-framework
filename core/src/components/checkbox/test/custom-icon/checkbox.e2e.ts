import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Phosphor Icons ship as SVG files, so they are supplied to the config as a
 * data URL. This is the `heart` icon at the `bold` weight.
 */
const phosphorHeart = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36a66.08,66.08,0,0,0-66,66c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Zm-5.49,142.36A328.69,328.69,0,0,1,128,210.16a328.69,328.69,0,0,1-44.51-31.8C61.82,159.77,36,131.42,36,102A42,42,0,0,1,78,60c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,69.4,160.2,60,178,60a42,42,0,0,1,42,42C220,131.42,194.18,159.77,172.51,178.36Z"/></svg>'
).toString('base64')}`;

/**
 * The icons are set through the global config rather than on the component,
 * so they are declared in the page content. An Ionicon name is used for the
 * indeterminate icon to cover different accepted formats.
 */
const customIcons = `
  <script>
    window.Ionic = {
      config: {
        checkboxCheckedIcon: '${phosphorHeart}',
        checkboxIndeterminateIcon: 'star',
      },
    };
  </script>
`;

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: custom icon'), () => {
    test('should render the checked icon set in the config', async ({ page }) => {
      await page.setContent(`${customIcons}<ion-checkbox checked="true">Label</ion-checkbox>`, config);

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-custom-checked-icon`));
    });

    test('should render the indeterminate icon set in the config', async ({ page }) => {
      await page.setContent(`${customIcons}<ion-checkbox indeterminate="true">Label</ion-checkbox>`, config);

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).toHaveScreenshot(screenshot(`checkbox-custom-indeterminate-icon`));
    });
  });
});
