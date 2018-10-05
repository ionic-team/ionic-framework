import { newE2EPage } from '@stencil/core/testing';

it('fab: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/basic?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
