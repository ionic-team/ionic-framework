import { newE2EPage } from '@stencil/core/testing';

test('footer: fade', async () => {
  const page = await newE2EPage({
    url: '/src/components/footer/test/fade?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
