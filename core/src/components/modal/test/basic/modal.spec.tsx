import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../../modal';
import { FOCUS_TRAP_DISABLE_CLASS } from '@utils/overlays';

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

describe('modal: focus trap', () => {
  it('should set the focus trap class when disabled', async () => {
    const page = await newSpecPage({
      components: [Modal],
      template: () => <ion-modal focusTrap={false} overlayIndex={1}></ion-modal>,
    });

    const modal = page.body.querySelector('ion-modal')!;

    expect(modal.classList.contains(FOCUS_TRAP_DISABLE_CLASS)).toBe(true);
  });
  it('should not set the focus trap class by default', async () => {
    const page = await newSpecPage({
      components: [Modal],
      template: () => <ion-modal overlayIndex={1}></ion-modal>,
    });

    const modal = page.body.querySelector('ion-modal')!;

    expect(modal.classList.contains(FOCUS_TRAP_DISABLE_CLASS)).toBe(false);
  });
});
