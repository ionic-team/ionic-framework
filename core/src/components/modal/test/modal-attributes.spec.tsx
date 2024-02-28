import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../modal';

it('should inherit attributes', async () => {
  /**
   * Note: This example should not be used in production.
   * This only serves to check that `role` can be customized.
   */
  const page = await newSpecPage({
    components: [Modal],
    template: () => <ion-modal overlayIndex={1} aria-label="my label" role="presentation"></ion-modal>,
  });

  const modal = page.body.querySelector('ion-modal')!;
  const contentWrapper = modal.shadowRoot!.querySelector('[part="content"]')!;

  expect(contentWrapper.getAttribute('aria-label')).toBe('my label');
  expect(contentWrapper.getAttribute('role')).toBe('presentation');
});

it('should inherit attributes when set via htmlAttributes', async () => {
  const page = await newSpecPage({
    components: [Modal],
    template: () => (
      <ion-modal overlayIndex={1} htmlAttributes={{ ariaLabel: 'my label', role: 'presentation' }}></ion-modal>
    ),
  });

  const modal = page.body.querySelector('ion-modal')!;
  const contentWrapper = modal.shadowRoot!.querySelector('[part="content"]')!;

  expect(contentWrapper.getAttribute('aria-label')).toBe('my label');
  expect(contentWrapper.getAttribute('role')).toBe('presentation');
});
