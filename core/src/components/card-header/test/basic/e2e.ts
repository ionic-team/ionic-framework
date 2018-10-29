import { newE2EPage } from '@stencil/core/testing';

it('card-header: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/card-header/test/basic?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
