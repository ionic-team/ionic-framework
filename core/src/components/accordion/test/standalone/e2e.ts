import { AxePuppeteer } from '@axe-core/puppeteer';
import { newE2EPage } from '@stencil/core/testing';

test('accordion: axe', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/standalone?ionic:_testing=true'
  });

  const results = await new AxePuppeteer(page).analyze();
  expect(results.violations.length).toEqual(0);
});

test('accordion: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
