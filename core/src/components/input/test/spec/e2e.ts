import { newE2EPage } from '@stencil/core/testing';

test('input: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/spec?ionic:_testing=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

test('input:rtl: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/spec?ionic:_testing=true&rtl=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
