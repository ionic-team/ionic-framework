import { newE2EPage } from '@stencil/core/testing';

it('button: size', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/size?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
