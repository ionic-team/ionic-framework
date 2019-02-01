import { newE2EPage } from '@stencil/core/testing';

test('toolbar: colors', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/colors'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
