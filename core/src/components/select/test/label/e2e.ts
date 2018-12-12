import { newE2EPage } from '@stencil/core/testing';

it('select: label', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/label?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
