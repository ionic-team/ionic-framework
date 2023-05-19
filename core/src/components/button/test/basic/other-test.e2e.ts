import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title }) => {
  test.describe.only(title('my special describe block'), () => {
    // eslint-disable-next-line no-empty-pattern
    test('test', ({}, testInfo) => {
      if (testInfo.project.name !== 'Mobile Chrome' && testInfo.retry === 0) {
        expect(false).toBe(true);
      }
    });
  });
});
