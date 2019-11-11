import { newE2EPage } from '@stencil/core/testing';

test('select: async', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/async?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
