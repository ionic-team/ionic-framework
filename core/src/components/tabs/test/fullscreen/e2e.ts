import { newE2EPage } from '@stencil/core/testing';

test('tab: fullscreen', async () => {
  const page = await newE2EPage({
    url: '/src/components/tabs/test/fullscreen?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
