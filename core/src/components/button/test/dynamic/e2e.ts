import { newE2EPage } from '@stencil/core/testing';

test('button: dynamic', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/dynamic?ionic:_testing=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  await page.click('#add-item-button');

  compares.push(await page.compareScreenshot('item button'));

  await page.click('#add-item-divider-button');

  compares.push(await page.compareScreenshot('item divider button'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
