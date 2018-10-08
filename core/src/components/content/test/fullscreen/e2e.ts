import { newE2EPage } from '@stencil/core/testing';

it('content: fullscreen', async () => {
  const page = await newE2EPage({
    url: '/src/components/content/test/fullscreen?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
