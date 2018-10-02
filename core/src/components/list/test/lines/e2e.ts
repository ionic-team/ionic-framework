import { newE2EPage } from '@stencil/core/testing';

it('list: lines', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/lines?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
