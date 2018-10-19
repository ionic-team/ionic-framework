import { newE2EPage } from '@stencil/core/testing';

it('list: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
