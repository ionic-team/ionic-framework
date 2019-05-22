import { newE2EPage } from '@stencil/core/testing';

test('segment: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/spec?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('segment:rtl: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/spec?ionic:_testing=true&rtl=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
