import { newE2EPage } from '@stencil/core/testing';

import { checkModeClasses } from '../utils';

// This test is to loop through all components that should have mode
// classes and test them
test('component: modes', async () => {
  const page = await newE2EPage({
    url: '/src/utils/test/modes?ionic:_testing=true'
  });

  await checkModeClasses(await page.find('ion-anchor'));
  await checkModeClasses(await page.find('ion-app'));
  await checkModeClasses(await page.find('ion-avatar'));
  await checkModeClasses(await page.find('ion-back-button'));
  await checkModeClasses(await page.find('ion-badge'));
  await checkModeClasses(await page.find('ion-button'));
  await checkModeClasses(await page.find('ion-buttons'));
  await checkModeClasses(await page.find('ion-card-content'));
  await checkModeClasses(await page.find('ion-card-header'));
  await checkModeClasses(await page.find('ion-card-subtitle'));
  await checkModeClasses(await page.find('ion-card-title'));
  await checkModeClasses(await page.find('ion-card'));
  await checkModeClasses(await page.find('ion-checkbox'));
  await checkModeClasses(await page.find('ion-chip'));
  await checkModeClasses(await page.find('ion-col'));

  await checkModeClasses(await page.find('ion-footer'));
  await checkModeClasses(await page.find('ion-header'));
  await checkModeClasses(await page.find('ion-item-group'));
  await checkModeClasses(await page.find('ion-list'));
  await checkModeClasses(await page.find('ion-slides'));
  await checkModeClasses(await page.find('ion-split-pane'));

});
