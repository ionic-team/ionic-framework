import { newE2EPage } from '@stencil/core/testing';

import { checkComponentModeClasses } from '../../../../utils/test/utils';

test('footer: translucent', async () => {
  const page = await newE2EPage({
    url: '/src/components/footer/test/translucent?ionic:_testing=true'
  });

  const globalMode = await page.evaluate(() => document.documentElement.getAttribute('mode'));
  await checkComponentModeClasses(await page.find('ion-footer'), globalMode!, 'footer-translucent');

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
