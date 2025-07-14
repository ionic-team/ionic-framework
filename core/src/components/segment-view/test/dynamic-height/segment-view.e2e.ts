import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment-view: dynamic height'), () => {
    test('should show the third content when clicking the third button', async ({ page, skip }) => {
      // Skip this test on Chrome and Firefox
      skip.browser('firefox', 'Original issue only happens on Safari.');
      skip.browser('chromium', 'Original issue only happens on Safari.');

      await page.setContent(
        `
        <style>
          ion-segment-content {
            display: flex;
            align-items: center;
            justify-content: center;
            height: fit-content;
          }
        </style>

        <ion-segment>
          <ion-segment-button value="first" content-id="first">
            <ion-label>First</ion-label>
          </ion-segment-button>
          <ion-segment-button value="second" content-id="second">
            <ion-label>Second</ion-label>
          </ion-segment-button>
          <ion-segment-button value="third" content-id="third">
            <ion-label>Third</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
          <ion-segment-content id="first">
            Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora
            quaeritis. Summus brains sit, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum
            mauris. Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
            comedat cerebella viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby. The
            voodoo sacerdos flesh eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum oculi eorum
            defunctis go lum cerebro. Nescio brains an Undead zombies. Sicut malus putrid voodoo horror. Nigh tofth eliv
          </ion-segment-content>
          <ion-segment-content id="second">
            <ion-input value="" label="Email"></ion-input>
          </ion-segment-content>
          <ion-segment-content id="third">
            <ion-img class="img-part" src="https://picsum.photos/200/300"></ion-img>
          </ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      // Click the third button
      await page.locator('ion-segment-button[value="third"]').click();

      // Wait for the content to be scrolled
      await page.waitForChanges();

      // Check that the third content is visible
      const segmentView = page.locator('ion-segment-view');
      const thirdContent = page.locator('ion-segment-content#third');

      const viewBox = await segmentView.boundingBox();
      const contentBox = await thirdContent.boundingBox();

      if (!viewBox || !contentBox) throw new Error('Bounding box not found');

      // Allow a small tolerance to account for subpixel rendering,
      // scrollbars, or layout rounding differences
      const tolerance = 10;
      expect(contentBox.x).toBeGreaterThanOrEqual(viewBox.x);
      expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(viewBox.x + viewBox.width + tolerance);
    });
  });
});
