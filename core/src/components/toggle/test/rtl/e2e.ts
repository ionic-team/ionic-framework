
import { newE2EPage } from '@stencil/core/testing';

test('toggle: RTL', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/rtl?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
