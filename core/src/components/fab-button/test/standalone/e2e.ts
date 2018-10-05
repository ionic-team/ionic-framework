import { newE2EPage } from '@stencil/core/testing';

it('fab-button: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab-button/test/standalone?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
