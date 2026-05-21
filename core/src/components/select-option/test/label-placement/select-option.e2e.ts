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

const JUSTIFY_VARIANTS = ['start', 'end', 'space-between'] as const;

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
    test.describe('alert interface', () => {
      for (const placement of ['start', 'end'] as const) {
        test(`placement ${placement}`, async ({ page }) => {
          await setContentForInterface(page, 'alert', placement, config);
          await page.addStyleTag({ content: ALERT_SIZE_OVERRIDES });

          const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
          await page.locator('#select').click();
          await ionAlertDidPresent.next();

          const alertWrapper = page.locator('ion-alert .alert-wrapper');
          await expect(alertWrapper).toHaveScreenshot(screenshot(`select-option-label-alert-${placement}`));
        });
      }
    });

    test.describe('popover interface', () => {
      for (const placement of ['start', 'end'] as const) {
        test(`placement ${placement}`, async ({ page }) => {
          await setContentForInterface(page, 'popover', placement, config);

          const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
          await page.locator('#select').click();
          await ionPopoverDidPresent.next();

          const popover = page.locator('ion-popover');
          await expect(popover).toHaveScreenshot(screenshot(`select-option-label-popover-${placement}`));
        });
      }
    });

    test.describe('modal interface', () => {
      for (const placement of ['start', 'end'] as const) {
        test(`placement ${placement}`, async ({ page }) => {
          await setContentForInterface(page, 'modal', placement, config);

          const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
          await page.locator('#select').click();
          await ionModalDidPresent.next();

          const modal = page.locator('ion-modal');
          await expect(modal).toHaveScreenshot(screenshot(`select-option-label-modal-${placement}`));
        });
      }
    });
  });
});
