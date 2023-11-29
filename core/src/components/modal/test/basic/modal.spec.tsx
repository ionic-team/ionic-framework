import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../../modal';

describe('modal: htmlAttributes inheritance', () => {
  it('should correctly inherit attributes on host', async () => {
    const page = await newSpecPage({
      components: [Modal],
      template: () => <ion-modal htmlAttributes={{ 'data-testid': 'basic-modal' }} overlayIndex={1}></ion-modal>,
    });

    const modal = page.body.querySelector('ion-modal')!;

    await expect(modal.getAttribute('data-testid')).toBe('basic-modal');
  });
});
