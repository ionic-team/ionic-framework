import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Returns each list button's `show` right after opening, when a
 * staggered list has only shown its first button.
 */
const activateAndGetShownButtons = (page: Page, selector: 'ion-fab' | 'ion-fab-list' = 'ion-fab') =>
  page.locator(selector).evaluate(async (el: HTMLIonFabElement | HTMLIonFabListElement) => {
    el.activated = true;
    await new Promise((resolve) => setTimeout(resolve, 0));
    return Array.from(el.querySelectorAll('ion-fab-list ion-fab-button')).map(
      (button) => (button as HTMLIonFabButtonElement).show
    );
  });

const listButtons = `
  <ion-fab-button><ion-icon name="logo-facebook"></ion-icon></ion-fab-button>
  <ion-fab-button><ion-icon name="logo-twitter"></ion-icon></ion-fab-button>
  <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
`;

const fabMarkup = ({ fabButtonAttrs = '', fabListAttrs = '' } = {}) => `
  <ion-fab>
    <ion-fab-button ${fabButtonAttrs}>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
    <ion-fab-list ${fabListAttrs}>${listButtons}</ion-fab-list>
  </ion-fab>
`;

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('fab-list: animation'), () => {
    test('should show the list buttons one at a time by default', async ({ page }) => {
      await page.setContent(fabMarkup(), config);

      expect(await activateAndGetShownButtons(page)).toEqual([true, false, false]);
      await expect(page.locator('ion-fab-list ion-fab-button').last()).toHaveClass(/fab-button-show/);
    });

    test('should show the list buttons one at a time by default outside of a fab', async ({ page }) => {
      await page.setContent(`<ion-fab-list>${listButtons}</ion-fab-list>`, config);

      expect(await activateAndGetShownButtons(page, 'ion-fab-list')).toEqual([true, false, false]);
    });

    test('should show all list buttons at once when animated is false outside of a fab', async ({ page }) => {
      await page.setContent(`<ion-fab-list animated="false">${listButtons}</ion-fab-list>`, config);

      expect(await activateAndGetShownButtons(page, 'ion-fab-list')).toEqual([true, true, true]);
    });

    test('should show all list buttons at once when the animated config is false', async ({ page }) => {
      await page.setContent(`<script>window.Ionic.config.animated = false;</script>${fabMarkup()}`, config);

      expect(await activateAndGetShownButtons(page)).toEqual([true, true, true]);
    });

    test('should show all list buttons at once when the user prefers reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setContent(fabMarkup(), config);

      expect(await activateAndGetShownButtons(page)).toEqual([true, true, true]);
    });

    test('should show all list buttons at once when the main fab button is not animated', async ({ page }) => {
      await page.setContent(fabMarkup({ fabButtonAttrs: 'animated="false"' }), config);

      expect(await activateAndGetShownButtons(page)).toEqual([true, true, true]);
    });

    test('should show all list buttons at once when the list is not animated under an animated main fab button', async ({
      page,
    }) => {
      await page.setContent(fabMarkup({ fabListAttrs: 'animated="false"' }), config);

      expect(await activateAndGetShownButtons(page)).toEqual([true, true, true]);
    });

    test('should show the list buttons one at a time when the list is animated under a main fab button that is not', async ({
      page,
    }) => {
      await page.setContent(fabMarkup({ fabButtonAttrs: 'animated="false"', fabListAttrs: 'animated="true"' }), config);

      expect(await activateAndGetShownButtons(page)).toEqual([true, false, false]);
    });
  });
});
