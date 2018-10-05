import { newE2EPage } from '@stencil/core/testing';

it('avatar: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/avatar/test/standalone?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
