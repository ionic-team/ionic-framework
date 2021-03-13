import { newE2EPage } from '@stencil/core/testing';

test('virtual-scroll: cards', async () => {
  const page = await newE2EPage({
    url: '/src/components/virtual-scroll/test/cards?ionic:_testing=true'
  });
  await page.waitForTimeout(300);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
