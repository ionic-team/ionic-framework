import { newE2EPage } from '@stencil/core/testing';

it('button: expand', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/expand?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
