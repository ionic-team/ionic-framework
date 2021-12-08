import { newE2EPage } from '@stencil/core/testing';
import { AxePuppeteer } from '@axe-core/puppeteer';

test('item: axe', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/a11y?ionic:_testing=true'
  });

  const results = await new AxePuppeteer(page)
    .disableRules('nested-interactive')
    .analyze();
  expect(results.violations.length).toEqual(0);
});
