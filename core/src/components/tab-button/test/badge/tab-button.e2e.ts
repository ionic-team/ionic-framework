import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('tab-button: badge'), () => {
    const positions = ['top', 'bottom'];
    const layouts = ['icon-top', 'icon-bottom', 'icon-start', 'icon-end', 'icon-hide', 'label-hide'];
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
          .map((position) => {
            const combinedLayouts: Record<string, string[]> = {
              'icon-only': layouts.filter((l) => l !== 'icon-hide'),
              'label-only': layouts.filter((l) => l !== 'label-hide'),
            };

            const variantGroups = slotVariants
              .map((variant) => {
                if (variant.label === 'icon-only' || variant.label === 'label-only') {
                  const tabs = combinedLayouts[variant.label]
                    .map((layout, i) => {
                      const label = variant.hasLabel ? `<ion-label>Tab ${i + 1}</ion-label>` : '';
                      const icon = variant.hasIcon ? `<ion-icon name="${icons[i % icons.length]}"></ion-icon>` : '';

                      return `
                          <ion-tab-button tab="tab-${position}-${variant.label}-${layout}" layout="${layout}">
                            ${label}
                            ${icon}
                            <ion-badge hue="bold" shape="round" color="${
                              colors[i % colors.length]
                            }" size="${badgeSize}" vertical="${position}">${contents[i % contents.length]}</ion-badge>
                          </ion-tab-button>
                        `;
                    })
                    .join('\n');

                  return `
                  <h3>${variant.label}</h3>
                  <ion-tab-bar>${tabs}</ion-tab-bar>
                `;
                }

                const layoutRows = layouts
                  .map((layout) => {
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
                      <h4>${layout}</h4>
                      <ion-tab-bar>${tabs}</ion-tab-bar>
                    `;
                  })
                  .join('\n');

                return `
                  <h3>${variant.label}</h3>
                  ${layoutRows}
                `;
              })
              .join('\n');

            return `
              <h2>badge position: ${position}</h2>
              ${variantGroups}
            `;
          })
          .join('\n');

        await page.setContent(
          `
            <style>
              h2 {
                font-size: 12px;
                font-weight: 600;
                color: #3c3f44;
                margin: 14px 0 4px 0;
              }

              h3 {
                font-size: 12px;
                font-weight: normal;
                color: #6f7378;
                margin: 8px 0 2px 8px;
              }

              h4 {
                font-size: 11px;
                font-weight: normal;
                color: #9ba0a6;
                margin: 4px 0 2px 16px;
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
        await page.setViewportSize({ width: Math.ceil(box!.width) + 90, height: Math.ceil(box!.height) + 32 });

        await expect(container).toHaveScreenshot(screenshot(`tab-button-badge-${badgeSize}`));
      });
    });
  });
});
