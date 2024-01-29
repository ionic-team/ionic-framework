import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../../modal';

describe('modal: a11y', () => {
  it('should allow for custom role', async () => {
    /**
     * Note: This example should not be used in production.
     * This only serves to check that `role` can be customized.
     */
    const page = await newSpecPage({
      components: [Modal],
      html: `
        <ion-modal role="alertdialog"></ion-modal>
      `,
    });

    const modal = page.body.querySelector('ion-modal')!;
    const modalWrapper = modal.shadowRoot!.querySelector('.modal-wrapper')!;

    await expect(modalWrapper.getAttribute('role')).toBe('alertdialog');
  });
});
