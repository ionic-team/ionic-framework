import { newE2EPage } from '@stencil/core/testing';

test('virtual-scroll: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/virtual-scroll/test/basic?ionic:_testing=true'
  });
  await page.waitForTimeout(300);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
