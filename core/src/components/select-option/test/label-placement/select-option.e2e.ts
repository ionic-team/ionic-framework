import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * iOS does not respect the viewport so styles must be updated instead.
 */
const ALERT_SIZE_OVERRIDES = `
  ion-alert {
    --max-width: 560px !important;
    --max-height: none !important;
  }
  ion-alert .alert-radio-group,
  ion-alert .alert-checkbox-group {
    max-height: none !important;
  }
`;

const INTERFACES = [
  { name: 'alert', presentEvent: 'ionAlertDidPresent', locator: 'ion-alert .alert-wrapper' },
  { name: 'popover', presentEvent: 'ionPopoverDidPresent', locator: 'ion-popover' },
  { name: 'modal', presentEvent: 'ionModalDidPresent', locator: 'ion-modal' },
] as const;

const JUSTIFY_VARIANTS = ['start', 'end', 'space-between'] as const;

const LABEL_PLACEMENTS = ['start', 'end'] as const;

const FIRST_OPTION_VALUE = `${JUSTIFY_VARIANTS[0]}-short`;

const renderOptions = (labelPlacement: 'start' | 'end') =>
  JUSTIFY_VARIANTS.flatMap((justify) => {
    const longLabel = `Justify ${justify} — ${'long label '.repeat(6).trim()}`;
    return [
      `<ion-select-option value="${justify}-short" label-placement="${labelPlacement}" justify="${justify}">Justify ${justify}</ion-select-option>`,
      `<ion-select-option value="${justify}-long" label-placement="${labelPlacement}" justify="${justify}">${longLabel}</ion-select-option>`,
    ];
  }).join('');

const setContentForInterface = async (
  page: Page,
  interfaceName: 'alert' | 'popover' | 'modal',
  labelPlacement: 'start' | 'end',
  config: object
) => {
  await page.setContent(
    `
      <ion-select id="select" interface="${interfaceName}" label="Select" value="${FIRST_OPTION_VALUE}">
        ${renderOptions(labelPlacement)}
      </ion-select>
    `,
    config
  );
};

configs({ modes: ['md', 'ios', 'ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('select-option: label placement'), () => {
    for (const { name, presentEvent, locator } of INTERFACES) {
      test.describe(`${name} interface`, () => {
        for (const placement of LABEL_PLACEMENTS) {
          test(`placement ${placement}`, async ({ page }) => {
            await setContentForInterface(page, name, placement, config);

            if (name === 'alert') {
              await page.addStyleTag({ content: ALERT_SIZE_OVERRIDES });
            }

            const didPresent = await page.spyOnEvent(presentEvent);
            await page.locator('#select').click();
            await didPresent.next();

            const overlay = page.locator(locator);
            await expect(overlay).toHaveScreenshot(screenshot(`select-option-label-${name}-${placement}`));
          });
        }
      });
    }
  });
});
