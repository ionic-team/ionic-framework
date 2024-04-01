import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title(
      'infinite-scroll: appending small amounts to dom'
    ),
    () => {
      test('should load more after remaining in threshold', async ({
        page,
      }) => {
        await page.goto(
          '/src/components/infinite-scroll/test/small-dom-update',
          config
        );

        const ionInfiniteComplete =
          await page.spyOnEvent(
            'ionInfiniteComplete'
          );
        const content = page.locator(
          'ion-content'
        );
        const items = page.locator(
          '#list .item'
        );
        expect(
          await items.count()
        ).toBe(30);

        await content.evaluate(
          (el: HTMLIonContentElement) =>
            el.scrollToBottom(0)
        );
        await ionInfiniteComplete.next();

        /**
         * Even after appending we'll still be within
         * the infinite scroll's threshold
         */
        expect(
          await items.count()
        ).toBe(33);

        await content.evaluate(
          (el: HTMLIonContentElement) =>
            el.scrollToBottom(0)
        );
        await ionInfiniteComplete.next();

        /**
         * Scrolling down again without leaving
         * the threshold should still trigger
         * infinite scroll again.
         */
        expect(
          await items.count()
        ).toBe(36);
      });
    }
  );
});
