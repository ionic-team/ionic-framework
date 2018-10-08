import { newE2EPage } from '@stencil/core/testing';

it('fab: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
