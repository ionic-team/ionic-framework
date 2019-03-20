import { newE2EPage } from '@stencil/core/testing';

import { checkModeClasses } from '../../../../utils/test/utils';

test('card: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/card/test/basic?ionic:_testing=true'
  });

  await checkModeClasses(await page.find('ion-card'));
  await checkModeClasses(await page.find('ion-card-content'));
  await checkModeClasses(await page.find('ion-card-header'));
  await checkModeClasses(await page.find('ion-card-subtitle'));
  await checkModeClasses(await page.find('ion-card-title'));

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
