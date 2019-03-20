import { newE2EPage } from '@stencil/core/testing';

import { checkModeClasses } from '../../../../utils/test/utils';

test('badge: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/badge/test/basic?ionic:_testing=true'
  });

  await checkModeClasses(await page.find('ion-badge'));

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
