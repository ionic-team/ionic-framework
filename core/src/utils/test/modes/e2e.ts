import { newE2EPage } from '@stencil/core/testing';

import { checkComponentModeClasses, checkModeClasses } from '../utils';

// This test is to loop through all components that should have
// specific classes added and test them
test('component: modes', async () => {
  const page = await newE2EPage({
    url: '/src/utils/test/modes?ionic:_testing=true'
  });

  // First test: .button class
  // ----------------------------------------------------------------
  // components that need to have the `button` class
  // for use in styling by other components (`ion-buttons`)
  // e.g. <ion-back-button class="button">
  let tags = ['ion-button', 'ion-back-button', 'ion-menu-button'];

  for (const tag of tags) {
    const el = await page.find(tag);
    expect(el).toHaveClass('button');
  }

  // Second test: .item class
  // ----------------------------------------------------------------
  // components that need to have the `item` class
  // for use in styling by other components
  // e.g. <ion-item-divider class="item">
  tags = ['ion-item', 'ion-item-divider', 'ion-item-group'];

  for (const tag of tags) {
    const el = await page.find(tag);
    expect(el).toHaveClass('item');
  }

  // Third test: .{component}-{mode} class
  // ----------------------------------------------------------------
  // components that need to have their tag name
  // + mode as a class for internal styling
  // e.g. <ion-card-content class="card-content-md">
  tags = ['ion-card-content', 'ion-footer', 'ion-header', 'ion-infinite-scroll-content', 'ion-item-group', 'ion-item-options', 'ion-list', 'ion-picker', 'ion-refresher', 'ion-slides', 'ion-split-pane'];

  for (const tag of tags) {
    const el = await page.find(tag);
    await checkComponentModeClasses(el);
  }

  // Fourth test: .{mode} class
  // ----------------------------------------------------------------
  // components that need to have the mode class
  // added for external / user styling
  // e.g. <ion-badge class="md">
  tags = ['ion-action-sheet', 'ion-alert', 'ion-anchor', 'ion-app', 'ion-avatar', 'ion-back-button', 'ion-backdrop', 'ion-badge', 'ion-button', 'ion-buttons', 'ion-card-content', 'ion-card-header', 'ion-card-subtitle', 'ion-card-title', 'ion-card', 'ion-checkbox', 'ion-chip', 'ion-col', 'ion-content', 'ion-datetime', 'ion-fab', 'ion-fab-button', 'ion-fab-list', 'ion-footer', 'ion-grid', 'ion-header', 'ion-icon', 'ion-img', 'ion-infinite-scroll', 'ion-infinite-scroll-content', 'ion-input', 'ion-item', 'ion-item-divider', 'ion-item-group', 'ion-item-option', 'ion-item-options', 'ion-item-sliding', 'ion-label', 'ion-list', 'ion-list-header', 'ion-loading', 'ion-modal', 'ion-menu', 'ion-menu-button', 'ion-menu-toggle', 'ion-note', 'ion-picker', 'ion-picker-column', 'ion-popover', 'ion-progress-bar', 'ion-radio', 'ion-radio-group', 'ion-range', 'ion-refresher', 'ion-refresher-content', 'ion-reorder', 'ion-reorder-group', 'ion-ripple-effect', 'ion-row', 'ion-searchbar', 'ion-segment', 'ion-segment-button', 'ion-select', 'ion-select-option', 'ion-select-popover', 'ion-skeleton-text', 'ion-slide', 'ion-slides', 'ion-spinner', 'ion-split-pane', 'ion-tab-bar', 'ion-tab-button', 'ion-text', 'ion-textarea', 'ion-thumbnail', 'ion-title', 'ion-toast', 'ion-toggle', 'ion-toolbar'];

  const globalMode = await page.evaluate(() => document.documentElement.getAttribute('mode'));
  for (const tag of tags) {
    await page.waitForSelector(tag);
    const el = await page.find(tag);
    await checkModeClasses(el, globalMode!);
  }
});
