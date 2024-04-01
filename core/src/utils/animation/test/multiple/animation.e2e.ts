import { expect } from '@playwright/test';
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
    title('animation: multiple'),
    async () => {
      test(`should resolve grouped animations using web animations`, async ({
        page,
      }) => {
        await page.goto(
          '/src/utils/animation/test/multiple',
          config
        );
        await testMultiple(page);
      });

      /**
       * CSS animations will occasionally resolve out of order, so we skip for now
       */
      test.skip(`should resolve grouped animations using css animations`, async ({
        page,
      }) => {
        await page.goto(
          '/src/utils/animation/test/multiple?ionic:_forceCSSAnimations=true',
          config
        );
        await testMultiple(page);
      });
    }
  );
});

const testMultiple = async (
  page: E2EPage
) => {
  const ionAnimationFinished =
    await page.spyOnEvent(
      'ionAnimationFinished'
    );

  await page.click('.play');

  await ionAnimationFinished.next();
  await expect(
    ionAnimationFinished
  ).toHaveReceivedEventDetail(
    'AnimationCSubBFinished'
  );

  await ionAnimationFinished.next();
  await expect(
    ionAnimationFinished
  ).toHaveReceivedEventDetail(
    'AnimationBFinished'
  );

  await ionAnimationFinished.next();
  await expect(
    ionAnimationFinished
  ).toHaveReceivedEventDetail(
    'AnimationCSubAFinished'
  );

  await ionAnimationFinished.next();
  await expect(
    ionAnimationFinished
  ).toHaveReceivedEventDetail(
    'AnimationCFinished'
  );

  await ionAnimationFinished.next();
  await expect(
    ionAnimationFinished
  ).toHaveReceivedEventDetail(
    'AnimationAFinished'
  );

  await ionAnimationFinished.next();
  await expect(
    ionAnimationFinished
  ).toHaveReceivedEventDetail(
    'AnimationRootFinished'
  );

  await expect(
    ionAnimationFinished
  ).toHaveReceivedEventTimes(6);
};
