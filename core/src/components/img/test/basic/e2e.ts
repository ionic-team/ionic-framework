import { newE2EPage } from '@stencil/core/testing';

it('img: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/img/test/basic?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
