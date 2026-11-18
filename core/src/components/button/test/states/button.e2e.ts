import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const STATES = ['activated', 'focused'];

// `solid` is the default fill, so it renders without a `fill` attribute
const FILLS = ['solid', 'outline', 'clear'];

configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: states'), () => {
    STATES.forEach((state) => {
      test(`should render ${state} buttons`, async ({ page }) => {
        const buttons = FILLS.map((fill) => {
          const fillAttr = fill === 'solid' ? '' : ` fill="${fill}"`;

          return `
            <ion-button${fillAttr} class="ion-${state}">Button</ion-button>
            <ion-button color="warning"${fillAttr} class="ion-${state}">Button</ion-button>
          `;
        }).join('');

        await page.setContent(
          `
          <style>
            #container {
              display: grid;
              grid-template-columns: repeat(2, auto);
              justify-content: start;
              gap: 10px;
              padding: 6px;
            }
          </style>

          <div id="container">${buttons}</div>
        `,
          config
        );

        /**
         * A press shows a ripple along with `ion-activated`, so add one from
         * the center of each button, the same way a tap does in md and ionic-md.
         * The ripple is paused once it has faded in, while it is still growing.
         */
        if (state === 'activated') {
          await page.locator('ion-button ion-ripple-effect').evaluateAll((ripples: HTMLIonRippleEffectElement[]) => {
            ripples.forEach((ripple) => {
              const { left, top, width, height } = ripple.getBoundingClientRect();
              ripple.addRipple(left + width / 2, top + height / 2);
            });
          });

          const rippleEffects = page.locator('ion-ripple-effect .ripple-effect');

          // Wait for every ripple to be added, or the ones added late are not paused
          await expect(rippleEffects).toHaveCount(await page.locator('ion-button ion-ripple-effect').count());

          await rippleEffects.evaluateAll((effects) => {
            effects.forEach((effect) => {
              effect.getAnimations().forEach((animation) => {
                animation.pause();
                animation.currentTime = 75;
              });
            });
          });
        }

        const container = page.locator('#container');

        /**
         * Animations are allowed so the paused ripple is not fast-forwarded
         * to its end.
         */
        await expect(container).toHaveScreenshot(screenshot(`button-${state}`), { animations: 'allow' });
      });
    });
  });
});
