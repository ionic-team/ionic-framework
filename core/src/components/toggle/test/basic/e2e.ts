import { newE2EPage } from '@stencil/core/testing';

it('toggle: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/basic?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
