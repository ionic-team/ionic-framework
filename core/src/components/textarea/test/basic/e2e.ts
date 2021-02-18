import { newE2EPage } from '@stencil/core/testing';

test('textarea: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/textarea/test/basic?ionic:_testing=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  await page.waitForTimeout(250);
  compares.push(await page.compareScreenshot('value changed'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
