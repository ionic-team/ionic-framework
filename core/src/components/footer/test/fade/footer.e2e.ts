import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('footer: fade', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should not have visual regressions with fade footer', async ({ page, skip }) => {
    skip.mode('md', 'Translucent effect is only available in iOS mode.');
    skip.browser('firefox', 'Firefox has some issues rendering translucent effects on Linux.');

    await page.goto('/src/components/footer/test/fade');

    const footer = page.locator('ion-footer');
    expect(await footer.screenshot()).toMatchSnapshot(`footer-fade-blurred-diff-${page.getSnapshotSettings()}.png`);

    const content = page.locator('ion-content');
    await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

    expect(await footer.screenshot()).toMatchSnapshot(`footer-fade-not-blurred-diff-${page.getSnapshotSettings()}.png`);
  });

  /**
   * This test suite verifies that the fade effect for iOS is working correctly
   * when the `ion-footer` is using a custom scroll target with the `.ion-content-scroll-host`
   * selector.
   */
  test('should not have visual regressions with custom scroll target fade footer', async ({ page, skip }) => {
    skip.mode('md', 'Translucent effect is only available in iOS mode.');
    skip.browser('firefox', 'Firefox has some issues rendering translucent effects on Linux.');

    await page.setContent(`
      <ion-app>
        <div class="ion-page>
          <ion-header translucent="true">
            <ion-toolbar>
              <ion-title>Header</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen="true" scroll-y="false">
            <div id="scroll-target" class="ion-content-scroll-host">
              <h1>Content</h1>

              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas blandit, justo vitae rhoncus porttitor, massa elit molestie nisl, ut tincidunt orci enim ac ante. Vestibulum tincidunt dignissim elit. Morbi cursus hendrerit turpis, ut egestas tortor pulvinar sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus faucibus consequat purus vel mollis. Ut ultricies elit nunc. Quisque ultrices turpis vel augue auctor accumsan. Donec bibendum at nisi vel finibus. Fusce id imperdiet odio. Morbi orci ipsum, imperdiet ut iaculis sit amet, suscipit vulputate felis. Nullam arcu leo, volutpat eu porttitor sed, fringilla et arcu. Pellentesque ac libero sapien. Quisque id dui velit. Mauris et pretium tortor.</p>
              <p>Ut ultricies id augue vel aliquam. Etiam ornare finibus nisl, nec egestas urna. Nam pellentesque libero nec justo tristique lacinia. In sit amet gravida metus, ac tincidunt mauris. Fusce sit amet tempus turpis. Nulla ligula nunc, vestibulum quis quam in, feugiat aliquet nibh. Quisque in ante non nulla luctus gravida vel at lacus. Vivamus erat magna, elementum et dignissim nec, posuere eu ante. Praesent elementum, arcu scelerisque venenatis sodales, turpis nulla aliquam urna, id hendrerit est orci et purus. Duis sem ipsum, imperdiet eu elit id, tincidunt tempus sapien. Praesent tincidunt, sapien sed rhoncus euismod, lectus velit ornare nunc, dapibus varius turpis leo ut magna.</p>
              <p>Nam quis quam id ante mattis pulvinar non sed mauris. Donec tempor sed nulla at semper. Vivamus ac nunc bibendum, ullamcorper lacus quis, ornare massa. Cras gravida nibh risus, id sollicitudin eros ultricies non. Integer velit massa, suscipit tincidunt rhoncus ut, lacinia et nisl. Maecenas volutpat ipsum blandit sollicitudin lobortis. Suspendisse potenti. Cras non mi non arcu varius dapibus. Suspendisse maximus eget justo a lobortis. Donec nulla ipsum, efficitur eget velit eget, varius rutrum quam. Nulla metus risus, accumsan a tellus ac, faucibus blandit quam. Donec luctus, nisl ac ultricies ornare, nunc elit finibus magna, id elementum ante urna congue ex. Cras condimentum nisi sollicitudin tortor vestibulum luctus. Curabitur non ipsum et ex vestibulum congue.</p>
              <p>Maecenas rhoncus elit ut consectetur faucibus. Etiam sed sem sed mauris condimentum viverra sit amet at nibh. Mauris bibendum at purus a cursus. Suspendisse potenti. Donec vel lacus ac odio euismod lacinia id in urna. Donec commodo ipsum augue, at bibendum ex convallis suscipit. Nulla ac rhoncus odio. Aenean elementum est nec arcu ultricies dignissim.</p>
              <p>Sed tincidunt bibendum massa, egestas bibendum est imperdiet vitae. Fusce dignissim consectetur ante a fermentum. Morbi suscipit turpis sapien. Suspendisse eleifend sapien eget nunc mattis mattis. Phasellus rhoncus sodales libero a imperdiet. Nam in vulputate lectus. Proin accumsan enim non nibh sagittis ultricies. Nullam vitae ultricies nunc. Nullam ultrices dolor nec vehicula posuere.</p>
            </div>
          </ion-content>
          <ion-footer collapse="fade" translucent="true">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
              <img src="/src/components/footer/test/img.jpg" />
            </div>
            <ion-toolbar>
              <ion-title>Footer</ion-title>
            </ion-toolbar>
          </ion-footer>
        </div>
      </ion-app>

      <style>
        #scroll-target {
          position: absolute;
          top: 0;
          left: 0;

          height: 100%;
          width: 100%;
          overflow-y: auto;

          padding: 50px 0;
        }
      </style>
    `);

    const footer = page.locator('ion-footer');
    expect(await footer.screenshot()).toMatchSnapshot(`footer-fade-scroll-target-blurred-diff-${page.getSnapshotSettings()}.png`);

    const scrollTarget = page.locator('#scroll-target');
    await scrollTarget.evaluate((el: HTMLDivElement) => el.scrollTop = el.scrollHeight);

    expect(await footer.screenshot()).toMatchSnapshot(`footer-fade-scroll-target-not-blurred-diff-${page.getSnapshotSettings()}.png`);
  });
});
