import { newE2EPage } from '@stencil/core/testing';

test('fab: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/standalone?ionic:_testing=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  await page.click('#fab6');

  compares.push(await page.compareScreenshot('fab list close-img'));

  await page.click('#fab7');

  compares.push(await page.compareScreenshot('fab list close-ion-button'));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
