import { newE2EPage } from '@stencil/core/testing';

it('segment: modes', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/modes?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
