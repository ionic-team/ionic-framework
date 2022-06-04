import { newE2EPage } from '@stencil/core/testing';

test('nested: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/nested?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
