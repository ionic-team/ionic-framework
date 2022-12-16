import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: states', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
});
