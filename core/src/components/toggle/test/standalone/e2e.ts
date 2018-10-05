import { newE2EPage } from '@stencil/core/testing';

it('toggle: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/standalone?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
