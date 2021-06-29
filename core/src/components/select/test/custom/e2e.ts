import { newE2EPage } from '@stencil/core/testing';

test('select: custom', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/custom?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

test('select:rtl: custom', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/custom?ionic:_testing=true&rtl=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
