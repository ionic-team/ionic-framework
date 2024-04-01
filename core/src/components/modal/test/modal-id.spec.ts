import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../modal';

it('modal should be assigned an incrementing id', async () => {
  const page = await newSpecPage({
    components: [Modal],
    html: `<ion-modal is-open="true"></ion-modal>`,
  });
  let modal: HTMLIonModalElement;

  modal = page.body.querySelector(
    'ion-modal'
  )!;

  expect(modal).not.toBe(null);
  expect(modal.getAttribute('id')).toBe(
    'ion-overlay-1'
  );

  // Remove the modal from the DOM
  modal.remove();
  await page.waitForChanges();

  // Create a new modal to verify the id is incremented
  modal = document.createElement(
    'ion-modal'
  );
  modal.isOpen = true;
  page.body.appendChild(modal);
  await page.waitForChanges();

  modal = page.body.querySelector(
    'ion-modal'
  )!;

  expect(modal.getAttribute('id')).toBe(
    'ion-overlay-2'
  );

  // Presenting the same modal again should reuse the existing id

  modal.isOpen = false;
  await page.waitForChanges();
  modal.isOpen = true;
  await page.waitForChanges();

  modal = page.body.querySelector(
    'ion-modal'
  )!;

  expect(modal.getAttribute('id')).toBe(
    'ion-overlay-2'
  );
});
