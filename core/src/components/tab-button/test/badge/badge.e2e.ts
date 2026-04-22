import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('tab-button: badge'), () => {
    const positions = ['top', 'bottom'];
    const layouts = ['icon-top', 'icon-bottom'];
    const icons = ['star', 'globe', 'logo-facebook', 'chatbox'];
    const colors = ['danger', 'primary', 'warning', 'success'];
    const contents = ['', '1', '999+', '<ion-icon icon="star"></ion-icon>'];

    const slotVariants = [
      { label: 'icon-label', hasIcon: true, hasLabel: true },
      { label: 'icon-only', hasIcon: true, hasLabel: false },
      { label: 'label-only', hasIcon: false, hasLabel: true },
    ];

    ['small', 'medium', 'large'].forEach((badgeSize) => {
      test(`should not have visual regressions with ${badgeSize} badges`, async ({ page }) => {
        const tabBars = positions
          .flatMap((position) =>
            slotVariants.flatMap((variant) =>
              layouts.map((layout) => {
                const tabs = contents
                  .map((html, i) => {
                    const label = variant.hasLabel ? `<ion-label>Tab ${i + 1}</ion-label>` : '';
                    const icon = variant.hasIcon ? `<ion-icon name="${icons[i]}"></ion-icon>` : '';

                    return `
                  <ion-tab-button tab="tab-${position}-${variant.label}-${layout}-${i}" layout="${layout}">
                    ${label}
                    ${icon}
                    <ion-badge hue="bold" shape="round" color="${colors[i]}" size="${badgeSize}" vertical="${position}">${html}</ion-badge>
                  </ion-tab-button>
                `;
                  })
                  .join('\n');

                return `
                  <h2>badge position: ${position} / icon layout: ${layout}</h2>
                  <ion-tab-bar>${tabs}</ion-tab-bar>
                `;
              })
            )
          )
          .join('\n');

        await page.setContent(
          `
            <style>
              h2 {
                font-size: 12px;
                font-weight: normal;
                color: #6f7378;
                margin-top: 10px;
                margin-left: 5px;
              }
            </style>
            <div id="container">
              ${tabBars}
            </div>
          `,
          config
        );

        const container = page.locator('#container');

        /**
         * Content overflows the default viewport, causing
         * unrendered areas to appear black in the screenshot.
         * Resizing to fit content.
         */
        const box = await container.boundingBox();
        await page.setViewportSize({ width: Math.ceil(box!.width) + 32, height: Math.ceil(box!.height) + 32 });

        await expect(container).toHaveScreenshot(screenshot(`tab-button-badge-${badgeSize}`));
      });
    });
  });
});
