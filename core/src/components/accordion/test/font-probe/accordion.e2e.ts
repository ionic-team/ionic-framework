import { configs, test } from '@utils/test/playwright';

/**
 * TEMPORARY DIAGNOSTIC — delete once the ionic test font is pinned.
 *
 * Reports the font Chromium actually resolves for ionic-theme text on the CI
 * runner. The ionic stack starts with `-apple-system, system-ui, ...`, neither
 * of which exists on Linux, so the face that wins there is decided by
 * fontconfig and cannot be determined from the stylesheets alone.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, title }) => {
  test.describe(title('accordion: font probe'), () => {
    test('report the platform font used for ionic text', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'CSS.getPlatformFontsForNode is Chromium-only');

      await page.setContent(
        `
        <ion-accordion-group value="first">
          <ion-accordion value="first">
            <ion-item slot="header">
              <ion-label>Accordion title</ion-label>
            </ion-item>
            <div slot="content">This is the body of the accordion.</div>
          </ion-accordion>
        </ion-accordion-group>
      `,
        config
      );

      const client = await page.context().newCDPSession(page);
      await client.send('DOM.enable');
      await client.send('CSS.enable');

      const { root } = await client.send('DOM.getDocument', { depth: -1, pierce: true });

      for (const selector of ['ion-label', 'div[slot="content"]']) {
        const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector });
        if (!nodeId) {
          console.log(`FONT-PROBE ${selector}: node not found`);
          continue;
        }

        const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId });
        const computed = await page.locator(selector).evaluate((el) => {
          const s = getComputedStyle(el);
          return {
            fontFamily: s.fontFamily,
            fontWeight: s.fontWeight,
            fontSize: s.fontSize,
            letterSpacing: s.letterSpacing,
          };
        });

        console.log(`FONT-PROBE ${selector} used=${JSON.stringify(fonts)} computed=${JSON.stringify(computed)}`);
      }
    });
  });
});
