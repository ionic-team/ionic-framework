import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import type { IonChipSize } from '../../chip.interface';
import { ION_CHIP_SIZES } from '../../chip.interface';

const AVATAR_SRC =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjYzVkYmZmIiBkPSJNMCAwaDUxMnY1MTJIMHoiLz48cGF0aCBkPSJNMjU2IDMwNGM2MS42IDAgMTEyLTUwLjQgMTEyLTExMlMzMTcuNiA4MCAyNTYgODBzLTExMiA1MC40LTExMiAxMTIgNTAuNCAxMTIgMTEyIDExMnptMCA0MGMtNzQuMiAwLTIyNCAzNy44LTIyNCAxMTJ2NTZoNDQ4di01NmMwLTc0LjItMTQ5LjgtMTEyLTIyNC0xMTJ6IiBmaWxsPSIjODJhZWZmIi8+PC9zdmc+';

/**
 * The avatar size that fits each chip size. Only the ionic theme
 * lets the avatar's `size` prop set its size inside a chip.
 */
const AVATAR_SIZES: Record<IonChipSize, string> = {
  small: 'xxsmall',
  large: 'xsmall',
};

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: size'), () => {
    ION_CHIP_SIZES.forEach((size) => {
      test(`should render ${size} chip`, async ({ page }) => {
        await page.setContent(
          `<ion-chip size="${size}">
            <ion-label>${size.charAt(0).toUpperCase() + size.slice(1)}</ion-label>
          </ion-chip>`,
          config
        );

        const chip = page.locator('ion-chip');

        await expect(chip).toHaveScreenshot(screenshot(`chip-size-${size}`));
      });

      test(`should render ${size} chip with an icon`, async ({ page }) => {
        await page.setContent(
          `<ion-chip size="${size}">
            <ion-icon name="calendar-outline"></ion-icon>
            <ion-label>Icon</ion-label>
          </ion-chip>`,
          config
        );

        const chip = page.locator('ion-chip');

        await expect(chip).toHaveScreenshot(screenshot(`chip-size-${size}-icon`));
      });

      test(`should render ${size} chip with an avatar`, async ({ page }) => {
        await page.setContent(
          `<ion-chip size="${size}">
            <ion-avatar size="${AVATAR_SIZES[size]}">
              <img src="${AVATAR_SRC}" />
            </ion-avatar>
            <ion-label>Avatar</ion-label>
          </ion-chip>`,
          config
        );

        const chip = page.locator('ion-chip');

        await expect(chip).toHaveScreenshot(screenshot(`chip-size-${size}-avatar`));
      });
    });
  });
});
