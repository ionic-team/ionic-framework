import { newE2EPage } from '@stencil/core/testing';

it('radio-group: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/radio-group/test/standalone?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
