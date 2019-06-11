import { newE2EPage } from '@stencil/core/testing';

import { checkComponentModeClasses } from '../../../../utils/test/utils';

test('header: translucent', async () => {
  const page = await newE2EPage({
    url: '/src/components/header/test/translucent?ionic:_testing=true'
  });

  await checkComponentModeClasses(await page.find('ion-header'), 'header-translucent');

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
