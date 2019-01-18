import { newE2EPage } from '@stencil/core/testing';

test('fab: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot('fab: basic');
  expect(compare).toMatchScreenshot();
});

test('fab: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/basic?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot('fab: basic-rtl');
  expect(compare).toMatchScreenshot();
});
