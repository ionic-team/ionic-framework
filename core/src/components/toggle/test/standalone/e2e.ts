import { newE2EPage } from '@stencil/core/testing';

test('toggle: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
