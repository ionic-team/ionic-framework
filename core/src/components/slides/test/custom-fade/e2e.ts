import { newE2EPage } from '@stencil/core/testing';

test('slides: custom-fade', async () => {
  const page = await newE2EPage({
    url: '/src/components/slides/test/custom-fade?ionic:_testing=true'
  });

  await page.waitFor(500);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
