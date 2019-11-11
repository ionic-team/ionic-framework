import { newE2EPage } from '@stencil/core/testing';

test('icon: dir', async () => {
  const page = await newE2EPage({
    url: '/src/components/icon/test/dir?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('icon: dir, rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/icon/test/dir?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
