import { newE2EPage } from '@stencil/core/testing';

test('fab: states', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/states?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
