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
  await checkModeClasses(await page.find('ion-content'));
  await checkModeClasses(await page.find('ion-datetime'));
  await checkModeClasses(await page.find('ion-fab'));
  await checkModeClasses(await page.find('ion-fab-list'));
  await checkModeClasses(await page.find('ion-footer'));
  await checkModeClasses(await page.find('ion-grid'));
  await checkModeClasses(await page.find('ion-header'));
  await checkModeClasses(await page.find('ion-img'));
  await checkModeClasses(await page.find('ion-infinite-scroll'));
  await checkModeClasses(await page.find('ion-item-group'));
  await checkModeClasses(await page.find('ion-item-options'));
  await checkModeClasses(await page.find('ion-list'));
  await checkModeClasses(await page.find('ion-menu-toggle'));
  await checkModeClasses(await page.find('ion-radio-group'));
  await checkModeClasses(await page.find('ion-reorder-group'));
  await checkModeClasses(await page.find('ion-ripple-effect'));
  await checkModeClasses(await page.find('ion-row'));
  await checkModeClasses(await page.find('ion-select-option'));
  await checkModeClasses(await page.find('ion-skeleton-text'));
  await checkModeClasses(await page.find('ion-slide'));
  await checkModeClasses(await page.find('ion-slides'));
  await checkModeClasses(await page.find('ion-split-pane'));

});
