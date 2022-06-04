import { AxePuppeteer } from '@axe-core/puppeteer';
import { newE2EPage } from '@stencil/core/testing';

test('menu: axe', async () => {
  const page = await newE2EPage({
    url: '/src/components/menu/test/a11y?ionic:_testing=true',
  });

  const menu = await page.find('ion-menu');
  await menu.callMethod('open');
  await menu.waitForVisible();

  const results = await new AxePuppeteer(page).analyze();
  expect(results.violations.length).toEqual(0);
});
