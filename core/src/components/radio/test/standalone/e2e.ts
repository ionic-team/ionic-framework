import { newE2EPage } from '@stencil/core/testing';

test('radio: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/radio/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
