import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * Measures where the text is drawn, which differs from the
 * title's box when the text is centered.
 */
const getTextBox = (el: Element) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  const { left, right } = range.getBoundingClientRect();

  return { left, right };
};

/**
 * Pauses the transition once the large title copy starts animating,
 * on its first frame or just before its last one.
 */
const pauseTransition = (page: E2EPage, frame: 'first' | 'last') => {
  return page.evaluate(
    (frame) =>
      new Promise<void>((resolve) => {
        const check = () => {
          // A finished copy from an earlier transition stays in the page
          const isRunning = (animation: Animation) => animation.playState === 'running';
          const copy = document.querySelector('ion-title.ion-cloned-element');
          if (copy && copy.getAnimations().some(isRunning)) {
            document
              .getAnimations()
              .filter(isRunning)
              .forEach((animation) => {
                animation.pause();

                // The last frame finishes the transition, which hides the copy
                const endTime = Number(animation.effect!.getComputedTiming().endTime);
                animation.currentTime = frame === 'first' ? 0 : endTime - 1;
              });
            requestAnimationFrame(() => resolve());
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      }),
    frame
  );
};

/**
 * The large title transition only runs in ios mode, so every theme is
 * tested with it. Testing mode turns animations off, so it is disabled.
 */
configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('title: transition'), () => {
    // TODO(FW-7878): configs() has no md theme on ios mode, so the URL sets the theme
    ['ios', 'md', 'ionic'].forEach((theme) => {
      const goto = async (page: E2EPage) => {
        await page.goto(`/src/components/title/test/transition?ionic:_testing=false&ionic:theme=${theme}`, config);
        await expect(page.locator('page-inbox ion-title[size="large"]')).toHaveClass(/hydrated/);
      };

      test(`should start the large title copy on the title text in the ${theme} theme`, async ({ page }) => {
        await goto(page);
        const titleBox = await page.locator('page-inbox ion-title[size="large"]').evaluate(getTextBox);

        const transitionPaused = pauseTransition(page, 'first');
        await page.locator('page-inbox button.go[data-back-text="match"]').click();
        await transitionPaused;

        const copyBox = await page.locator('ion-title.ion-cloned-element').evaluate(getTextBox);

        expect(Math.abs(copyBox.left - titleBox.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(copyBox.right - titleBox.right)).toBeLessThanOrEqual(1);
      });

      test(`should end the large title copy on the title text when going back in the ${theme} theme`, async ({
        page,
      }) => {
        await goto(page);
        const titleBox = await page.locator('page-inbox ion-title[size="large"]').evaluate(getTextBox);

        await page.locator('page-inbox button.go[data-back-text="match"]').click();
        await expect(page.locator('page-inbox')).toHaveClass(/ion-page-hidden/);

        const transitionPaused = pauseTransition(page, 'last');
        await page.locator('page-message ion-back-button').click();
        await transitionPaused;

        const copyBox = await page.locator('ion-title.ion-cloned-element').evaluate(getTextBox);

        expect(Math.abs(copyBox.left - titleBox.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(copyBox.right - titleBox.right)).toBeLessThanOrEqual(1);
      });

      [
        { label: 'default', color: undefined, hue: undefined },
        { label: 'bold primary', color: 'primary', hue: 'bold' },
        { label: 'subtle primary', color: 'primary', hue: 'subtle' },
      ].forEach(({ label, color, hue }) => {
        test(`should give the copy the ${label} title color and font in the ${theme} theme`, async ({ page }) => {
          await goto(page);

          const largeTitle = page.locator('page-inbox ion-title[size="large"]');
          await largeTitle.evaluate(
            (el: HTMLIonTitleElement, { color, hue }) => {
              el.color = color;
              el.hue = hue as HTMLIonTitleElement['hue'];
            },
            { color, hue }
          );
          await page.waitForChanges();

          const getTextStyles = (el: Element) => {
            const { color, fontFamily } = getComputedStyle(el);
            return { color, fontFamily };
          };
          const titleStyles = await largeTitle.evaluate(getTextStyles);

          const transitionPaused = pauseTransition(page, 'first');
          await page.locator('page-inbox button.go[data-back-text="match"]').click();
          await transitionPaused;

          const copyStyles = await page.locator('ion-title.ion-cloned-element').evaluate(getTextStyles);

          expect(copyStyles).toEqual(titleStyles);
        });
      });
    });
  });
});
