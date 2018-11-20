import { newE2EPage } from '@stencil/core/testing';

test('note: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/note/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
