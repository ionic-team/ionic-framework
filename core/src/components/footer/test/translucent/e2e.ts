import { newE2EPage } from '@stencil/core/testing';

import { checkModeClasses } from '../../../../utils/test/utils';

test('footer: translucent', async () => {
  const page = await newE2EPage({
    url: '/src/components/footer/test/translucent?ionic:_testing=true'
  });

  await checkModeClasses(await page.find('ion-footer'));
  await checkModeClasses(await page.find('ion-footer'), 'footer-translucent');

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
