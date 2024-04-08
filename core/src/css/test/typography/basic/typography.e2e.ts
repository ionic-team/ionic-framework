import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Typography styles are only available in the Ionic theme
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('typography: global styles'), () => {
    test('should apply the globals styles for each semantic tag', async ({ page }) => {
      await page.setContent(
        `
        <link href="/css/typography.ionic.css" rel="stylesheet" />
        <div>
          <h1>H1: The quick brown fox jumps over the lazy dog</h1>
          <h2>H2: The quick brown fox jumps over the lazy dog</h2>
          <h3>H3: The quick brown fox jumps over the lazy dog</h3>
          <h4>H4: The quick brown fox jumps over the lazy dog</h4>
          <h5>H5: The quick brown fox jumps over the lazy dog</h5>
          <h6>H6: The quick brown fox jumps over the lazy dog</h6>
          <p><ion-text class="ionic-font-size-l"><p>Tag_P FontLarge: The quick brown fox jumps over the lazy dog</p></ion-text><p>
          <p><ion-text class="ionic-font-size-m">Tag_None FontMedium: The quick brown fox jumps over the lazydog</ion-text></p>
          <p><ion-text class="ionic-font-size-s"><span>Tag_Span FontSmall: The quick brown fox jumps over the lazy dog</span></ion-text></p>
        </div>
      `,
        config
      );

      const div = page.locator('div');
      await expect(div).toHaveScreenshot(screenshot(`ionic-semantic-global-styles`));
    });

    test('should apply the utility classes for each heading', async ({ page }) => {
      await page.setContent(
        `
        <link href="/css/typography.ionic.css" rel="stylesheet" />
        <div>
          <h1 class="ionic-heading2 ionic-font-weight-light">Tag H1 - Style Heading 2 - Font Light</h1>
          <h2 class="ionic-heading3 ionic-font-weight-light">Tag H2 - Style Heading 3 - Font Light</h2>
          <h3 class="ionic-heading4">Tag H3 - Style Heading 4 - Font Regular</h3>
          <h4 class="ionic-heading5 ionic-font-weight-medium">Tag H4 - Style Heading 5 - Font Medium</h4>
          <h5 class="ionic-heading6">Tag H5 - Style Heading 6 - Font Semibold</h5>
          <h6 class="ionic-heading1 ionic-font-weight-bold">Tag H6 - Style Heading 1 - Font Bold</h6>
        </div>
      `,
        config
      );

      const div = page.locator('div');
      await expect(div).toHaveScreenshot(screenshot(`ionic-utility-classes-semantic-tags`));
    });

    test('should apply the heading classes on ion-text element', async ({ page }) => {
      await page.setContent(
        `
        <link href="/css/typography.ionic.css" rel="stylesheet" />
        <div>
          <p><ion-text class="ionic-heading1">Utility class 'ionic-heading1'</ion-text></p>
          <p><ion-text class="ionic-heading2">Utility class 'ionic-heading2'</ion-text></p>
          <p><ion-text class="ionic-heading3">Utility class 'ionic-heading3'</ion-text></p>
          <p><ion-text class="ionic-heading4">Utility class 'ionic-heading4'</ion-text></p>
          <p><ion-text class="ionic-heading5">Utility class 'ionic-heading5'</ion-text></p>
          <p><ion-text class="ionic-heading6">Utility class 'ionic-heading6'</ion-text></p>
        </div>
      `,
        config
      );

      const div = page.locator('div');
      await expect(div).toHaveScreenshot(screenshot(`ionic-utility-classes-headings`));
    });

    test('should apply the utility classes for font weights', async ({ page }) => {
      await page.setContent(
        `
        <link href="/css/typography.ionic.css" rel="stylesheet" />
        <div>
          <p><ion-text class="ionic-font-weight-light">Utility class 'ionic-font-light'</ion-text></p>
          <p><ion-text class="ionic-font-weight-regular">Utility class 'ionic-font-regular'</ion-text></p>
          <p><ion-text class="ionic-font-weight-medium">Utility class 'ionic-font-medium'</ion-text></p>
          <p><ion-text class="ionic-font-weight-semi-bold">Utility class 'ionic-font-semibold'</ion-text></p>
          <p><ion-text class="ionic-font-weight-bold">Utility class 'ionic-font-bold'</ion-text></p>
        </div>
      `,
        config
      );

      const div = page.locator('div');
      await expect(div).toHaveScreenshot(screenshot(`ionic-utility-classes-font-weights`));
    });

    test('should apply the utility classes for font display', async ({ page }) => {
      await page.setContent(
        `
        <link href="/css/typography.ionic.css" rel="stylesheet" />
        <div>
          <p><ion-text class="ionic-display-s">Utility class 'ionic-display-s'</ion-text></p>
          <p><ion-text class="ionic-display-m">Utility class 'ionic-display-m'</ion-text></p>
        </div>
      `,
        config
      );

      const div = page.locator('div');
      await expect(div).toHaveScreenshot(screenshot(`ionic-utility-classes-font-displays`));
    });
  });
});
