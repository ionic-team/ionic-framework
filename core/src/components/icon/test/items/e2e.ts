import { newE2EPage } from '@stencil/core/testing';

it('icon: items', async () => {
  const page = await newE2EPage({
    url: '/src/components/icon/test/items?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
