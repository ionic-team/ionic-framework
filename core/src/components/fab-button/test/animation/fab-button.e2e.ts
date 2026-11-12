import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

type StyleProperty = 'transform' | 'transitionDuration' | 'transitionProperty';

const getStyles = async (fabButton: Locator, property: StyleProperty) => {
  const getStyle = (selector: string) =>
    fabButton.locator(selector).evaluate((el, prop: StyleProperty) => getComputedStyle(el)[prop], property);

  return {
    native: await getStyle('[part="native"]'),
    inner: await getStyle('.button-inner'),
    closeIcon: await getStyle('[part="close-icon"]'),
  };
};

const expectNoTransitions = async (fabButton: Locator) => {
  expect(await getStyles(fabButton, 'transitionDuration')).toEqual({ native: '0s', inner: '0s', closeIcon: '0s' });
};

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('fab-button: animation'), () => {
    test('should transition by default', async ({ page }) => {
      await page.setContent(
        `
        <ion-fab-button>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      `,
        config
      );

      const { native, inner, closeIcon } = await getStyles(page.locator('ion-fab-button'), 'transitionDuration');
      expect(native).not.toBe('0s');
      expect(inner).not.toBe('0s');
      expect(closeIcon).not.toBe('0s');
    });

    test('should not transition when animated is false', async ({ page }) => {
      await page.setContent(
        `
        <ion-fab-button animated="false">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      `,
        config
      );

      await expectNoTransitions(page.locator('ion-fab-button'));
    });

    test('should not transition when the animated config is false', async ({ page }) => {
      await page.setContent(
        `
        <script>window.Ionic.config.animated = false;</script>
        <ion-fab-button>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      `,
        config
      );

      await expectNoTransitions(page.locator('ion-fab-button'));
    });

    test('should fade the icons without scaling or rotating them when the user prefers reduced motion', async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setContent(
        `
        <ion-fab-button>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      `,
        config
      );

      const fabButton = page.locator('ion-fab-button');
      expect(await getStyles(fabButton, 'transitionDuration')).toEqual({
        native: '0s',
        inner: '0.3s',
        closeIcon: '0.3s',
      });
      expect(await getStyles(fabButton, 'transitionProperty')).toMatchObject({
        inner: 'opacity',
        closeIcon: 'opacity',
      });
      expect(await getStyles(fabButton, 'transform')).toMatchObject({ inner: 'none', closeIcon: 'none' });

      await fabButton.evaluate((el: HTMLIonFabButtonElement) => (el.activated = true));
      await page.waitForChanges();

      expect(await getStyles(fabButton, 'transform')).toMatchObject({ inner: 'none', closeIcon: 'none' });
    });
  });
});

/**
 * Only ios scales the button while it is pressed.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('fab-button: animation'), () => {
    test('should not scale the pressed button when the user prefers reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setContent(
        `
        <ion-fab-button>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      `,
        config
      );

      const fabButton = page.locator('ion-fab-button');
      await fabButton.evaluate((el) => el.classList.add('ion-activated'));

      expect(await getStyles(fabButton, 'transform')).toMatchObject({ native: 'none' });
    });
  });
});
