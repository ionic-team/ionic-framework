import { newE2EPage } from '@stencil/core/testing';

test('note: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/note/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
