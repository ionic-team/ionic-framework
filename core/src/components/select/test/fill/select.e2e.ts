import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: fill', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('ios', 'Fill is only available in MD mode');
  });

  test.describe('select: fill solid', () => {
  });
  test.describe('select: fill outline', () => {
  });
});
