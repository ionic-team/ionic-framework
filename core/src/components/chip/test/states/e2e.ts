import { newE2EPage } from '@stencil/core/testing';

test('chip: states', async () => {
  const page = await newE2EPage({
    url: '/src/components/chip/test/states?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
