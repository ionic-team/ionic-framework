import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This test verifies that collapsible headers with mode="ios" work correctly
 * when both iOS and MD stylesheets are loaded. The bug occurred because
 * `.header-collapse-condense { display: none }` in the MD stylesheet was not
 * scoped to `.header-md`, causing it to hide iOS condense headers when both
 * stylesheets were present.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('header: condense with iOS mode override'), () => {
    test('should show iOS condense header when both MD and iOS styles are loaded', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29929',
      });

      // Include both an MD header and an iOS modal to force both stylesheets to load
      await page.setContent(
        `
        <!-- MD header to force MD stylesheet to load -->
        <ion-header mode="md" id="mdHeader">
          <ion-toolbar>
            <ion-title>MD Header</ion-title>
          </ion-toolbar>
        </ion-header>

        <!-- Modal with iOS condense header -->
        <ion-modal>
          <ion-header mode="ios" id="smallTitleHeader">
            <ion-toolbar>
              <ion-title>Header</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen="true">
            <ion-header collapse="condense" mode="ios" id="largeTitleHeader">
              <ion-toolbar>
                <ion-title size="large">Large Header</ion-title>
              </ion-toolbar>
            </ion-header>
            <p>Content</p>
          </ion-content>
        </ion-modal>
        `,
        config
      );

      const modal = page.locator('ion-modal');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await modal.evaluate((el: HTMLIonModalElement) => el.present());
      await ionModalDidPresent.next();

      const largeTitleHeader = modal.locator('#largeTitleHeader');

      // The large title header should be visible, not hidden by MD styles
      await expect(largeTitleHeader).toBeVisible();

      // Verify it has the iOS mode class
      await expect(largeTitleHeader).toHaveClass(/header-ios/);

      // Verify it does NOT have display: none applied
      // This would fail if the MD stylesheet's unscoped .header-collapse-condense rule applies
      const display = await largeTitleHeader.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).not.toBe('none');
    });
  });
});
