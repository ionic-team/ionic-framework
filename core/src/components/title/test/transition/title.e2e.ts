import { expect } from '@playwright/test';
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
 * The large title transition only runs in ios mode, so every theme is
 * tested with it. Testing mode turns animations off, so it is disabled.
 */
configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('title: transition'), () => {
    ['ios', 'md', 'ionic'].forEach((theme) => {
      test(`should start the large title copy on the title text in the ${theme} theme`, async ({ page }) => {
        await page.goto(`/src/components/title/test/transition?ionic:_testing=false&ionic:theme=${theme}`, config);

        const largeTitle = page.locator('page-inbox ion-title[size="large"]');
        await expect(largeTitle).toHaveClass(/hydrated/);
        const titleBox = await largeTitle.evaluate(getTextBox);

        // Pauses the transition on its first frame once the copy starts animating
        const transitionStarted = page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              const check = () => {
                const copy = document.querySelector('ion-title.ion-cloned-element');
                if (copy && copy.getAnimations().length > 0) {
                  document.getAnimations().forEach((animation) => {
                    animation.pause();
                    animation.currentTime = 0;
                  });
                  requestAnimationFrame(() => resolve());
                } else {
                  requestAnimationFrame(check);
                }
              };
              check();
            })
        );

        await page.locator('page-inbox button.go[data-back-text="match"]').click();
        await transitionStarted;

        const copyBox = await page.locator('ion-title.ion-cloned-element').evaluate(getTextBox);

        expect(Math.abs(copyBox.left - titleBox.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(copyBox.right - titleBox.right)).toBeLessThanOrEqual(1);
      });
    });
  });
});
