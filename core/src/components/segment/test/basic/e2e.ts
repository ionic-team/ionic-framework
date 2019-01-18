import { newE2EPage } from '@stencil/core/testing';

test('segment: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/basic?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('segment: basic');
  expect(compare).toMatchScreenshot();
});

test('segment: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/basic?ionic:_testing=true&rtl=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('segment: basic-rtl');
  expect(compare).toMatchScreenshot();
});
