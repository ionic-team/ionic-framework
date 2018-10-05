import { newE2EPage } from '@stencil/core/testing';

it('button: icon', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/icon?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
