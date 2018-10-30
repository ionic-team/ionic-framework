import { newE2EPage } from '@stencil/core/testing';

test('segment: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/standalone?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
