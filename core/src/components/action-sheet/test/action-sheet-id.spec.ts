import { newSpecPage } from '@stencil/core/testing';

import { ActionSheet } from '../action-sheet';

it('action sheet should be assigned an incrementing id', async () => {
  const page = await newSpecPage({
    components: [ActionSheet],
    html: `<ion-action-sheet is-open="true"></ion-action-sheet>`,
  });
  let actionSheet: HTMLIonActionSheetElement;

  actionSheet = page.body.querySelector('ion-action-sheet')!;

  expect(actionSheet).not.toBe(null);
  expect(actionSheet.getAttribute('id')).toBe('ion-overlay-1');

  // Remove the action sheet from the DOM
  actionSheet.remove();
  await page.waitForChanges();

  // Create a new action sheet to verify the id is incremented
  actionSheet = document.createElement('ion-action-sheet');
  actionSheet.isOpen = true;
  page.body.appendChild(actionSheet);
  await page.waitForChanges();

  actionSheet = page.body.querySelector('ion-action-sheet')!;

  expect(actionSheet.getAttribute('id')).toBe('ion-overlay-2');

  // Presenting the same action sheet again should reuse the existing id

  actionSheet.isOpen = false;
  await page.waitForChanges();
  actionSheet.isOpen = true;
  await page.waitForChanges();

  actionSheet = page.body.querySelector('ion-action-sheet')!;

  expect(actionSheet.getAttribute('id')).toBe('ion-overlay-2');
});
