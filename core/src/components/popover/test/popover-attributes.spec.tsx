import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Popover } from '../popover';

describe('popover: attributes', () => {
  it('should have role="dialog" alongside aria-modal', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover overlayIndex={1}></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;
    expect(popover.getAttribute('role')).toBe('dialog');
    expect(popover.getAttribute('aria-modal')).toBe('true');
  });

  it('should allow the role to be overridden via htmlAttributes', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover overlayIndex={1} htmlAttributes={{ role: 'alertdialog' }}></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;
    expect(popover.getAttribute('role')).toBe('alertdialog');
  });
});
