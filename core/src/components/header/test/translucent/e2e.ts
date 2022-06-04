import { newE2EPage } from '@stencil/core/testing';
import { checkComponentModeClasses } from '@utils/test';

test('header: translucent', async () => {
  const page = await newE2EPage({
    url: '/src/components/header/test/translucent?ionic:_testing=true',
  });

  const globalMode = await page.evaluate(() => document.documentElement.getAttribute('mode'));
  await checkComponentModeClasses(await page.find('ion-header'), globalMode!, 'header-translucent');

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
