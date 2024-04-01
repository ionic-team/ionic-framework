import {
  configs,
  test,
} from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('animation: basic'),
    async () => {
      test(`should resolve using web animations`, async ({
        page,
      }) => {
        await page.goto(
          '/src/utils/animation/test/basic',
          config
        );
        await testPage(page);
      });

      test(`should resolve using css animations`, async ({
        page,
      }) => {
        await page.goto(
          '/src/utils/animation/test/basic?ionic:_forceCSSAnimations=true',
          config
        );
        await testPage(page);
      });
    }
  );
});

const testPage = async (
  page: E2EPage
) => {
  const ionAnimationFinished =
    await page.spyOnEvent(
      'ionAnimationFinished'
    );

  await page.click('.play');

  await ionAnimationFinished.next();
};
