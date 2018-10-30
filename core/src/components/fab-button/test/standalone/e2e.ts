import { newE2EPage } from '@stencil/core/testing';

test('fab-button: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab-button/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
