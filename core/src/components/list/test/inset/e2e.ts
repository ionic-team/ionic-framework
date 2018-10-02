import { newE2EPage } from '@stencil/core/testing';

it('list: inset', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/inset?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
