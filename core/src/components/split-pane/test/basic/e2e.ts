import { newE2EPage } from '@stencil/core/testing';

it('split-pane: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/split-pane/test/basic?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
