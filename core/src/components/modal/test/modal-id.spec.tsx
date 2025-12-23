import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../modal';

describe('modal: id', () => {
  it('modal should be assigned an incrementing id', async () => {
    const page = await newSpecPage({
      components: [Modal],
      html: `<ion-modal is-open="true"></ion-modal>`,
    });
    let modal: HTMLIonModalElement;

    modal = page.body.querySelector('ion-modal')!;

    expect(modal).not.toBe(null);
    expect(modal.getAttribute('id')).toBe('ion-overlay-1');

    // Remove the modal from the DOM
    modal.remove();
    await page.waitForChanges();

    // Create a new modal to verify the id is incremented
    modal = document.createElement('ion-modal');
    modal.isOpen = true;
    page.body.appendChild(modal);
    await page.waitForChanges();

    modal = page.body.querySelector('ion-modal')!;

    expect(modal.getAttribute('id')).toBe('ion-overlay-2');

    // Presenting the same modal again should reuse the existing id

    modal.isOpen = false;
    await page.waitForChanges();
    modal.isOpen = true;
    await page.waitForChanges();

    modal = page.body.querySelector('ion-modal')!;

    expect(modal.getAttribute('id')).toBe('ion-overlay-2');
  });

  it('should not overwrite the id set in htmlAttributes', async () => {
    const id = 'custom-id';
    const page = await newSpecPage({
      components: [Modal],
      template: () => <ion-modal htmlAttributes={{ id }} overlayIndex={-1}></ion-modal>,
    });

    const alert = page.body.querySelector('ion-modal')!;
    expect(alert.id).toBe(id);
  });

  it('should allow multiple modals with the same id', async () => {
    const sharedId = 'shared-modal-id';

    const page = await newSpecPage({
      components: [Modal],
      template: () => [
        <ion-modal id={sharedId} overlayIndex={1} is-open={true}></ion-modal>,
        <ion-modal id={sharedId} overlayIndex={2} is-open={true}></ion-modal>,
      ],
    });

    const modals = page.body.querySelectorAll('ion-modal');
    expect(modals.length).toBe(2);
    expect(modals[0].id).toBe(sharedId);
    expect(modals[1].id).toBe(sharedId);
  });
});
