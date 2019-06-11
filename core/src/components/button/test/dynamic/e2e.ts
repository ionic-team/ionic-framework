import { newE2EPage } from '@stencil/core/testing';

test('button: dynamic', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/dynamic?ionic:_testing=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  await page.click('#add-item-button');

  compares.push(await page.compareScreenshot('add item button'));

  await page.click('#add-item-divider-button');

  compares.push(await page.compareScreenshot('add item divider button'));

  await page.click('#change-item-button');

  compares.push(await page.compareScreenshot('change item button size'));

  await page.click('#change-item-divider-button');

  compares.push(await page.compareScreenshot('change item divider button size'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
