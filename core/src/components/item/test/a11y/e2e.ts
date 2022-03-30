import { AxePuppeteer } from '@axe-core/puppeteer';
import { newE2EPage } from '@stencil/core/testing';

test('item: axe', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/a11y?ionic:_testing=true'
  });

  const results = await new AxePuppeteer(page)
    // TODO(FW-404): Re-enable rule once select is updated to avoid nested-interactive
    .disableRules('nested-interactive')
    .analyze();
  expect(results.violations.length).toEqual(0);
});
