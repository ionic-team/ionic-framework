import { newE2EPage } from '@stencil/core/testing';

test('img: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/img/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
