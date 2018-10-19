import { newE2EPage } from '@stencil/core/testing';

it('note: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/note/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
