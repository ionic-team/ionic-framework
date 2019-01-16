import { newE2EPage } from '@stencil/core/testing';

const navChanged = () => new Promise(resolve => window.addEventListener('ionNavDidChange', resolve));

test.skip('nav: basic', async () => {

  const page = await newE2EPage({
    url: '/src/components/nav/test/basic?ionic:_testing=true'
  });

  expect(await page.compareScreenshot()).toMatchScreenshot();

  page.click('page-one ion-button.next');
  await page.waitFor(navChanged);
  page.click('page-two ion-button.next');
  await page.waitFor(navChanged);
  page.click('page-three ion-back-button');
  await page.waitFor(navChanged);
  page.click('page-two ion-back-button');
  await page.waitFor(navChanged);

  expect(await page.compareScreenshot('stack traversal')).toMatchScreenshot();
});
