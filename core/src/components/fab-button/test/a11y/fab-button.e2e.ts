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
      'fab-button: aria attributes'
    ),
    () => {
      test('should inherit aria attributes to inner button', async ({
        page,
      }) => {
        await page.setContent(
          `
        <ion-fab-button aria-label="Hello World">My Button</ion-fab-button>
      `,
          config
        );

        const nativeButton =
          page.locator(
            'ion-fab-button button'
          );
        await expect(
          nativeButton
        ).toHaveAttribute(
          'aria-label',
          'Hello World'
        );
      });
    }
  );
});
