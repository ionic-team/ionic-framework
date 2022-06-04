import { newE2EPage } from '@stencil/core/testing';

test('radio-group: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/radio-group/test/standalone?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
