import { newE2EPage } from '@stencil/core/testing';

it('button: clear', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/clear?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
