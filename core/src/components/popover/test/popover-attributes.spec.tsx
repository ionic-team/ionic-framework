import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Popover } from '../popover';

// Fixes https://github.com/ionic-team/ionic-framework/issues/31823
describe('popover: attributes', () => {
  it('should set the dialog role and aria-modal on the content', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover overlayIndex={1}></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;
    const content = popover.shadowRoot!.querySelector('[part="content"]')!;

    expect(content.getAttribute('role')).toBe('dialog');
    expect(content.getAttribute('aria-modal')).toBe('true');
    expect(popover.hasAttribute('aria-modal')).toBe(false);
  });

  it('should inherit attributes', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => <ion-popover overlayIndex={1} aria-label="my label" role="alertdialog"></ion-popover>,
    });

    const popover = page.body.querySelector('ion-popover')!;
    const content = popover.shadowRoot!.querySelector('[part="content"]')!;

    expect(content.getAttribute('aria-label')).toBe('my label');
    expect(content.getAttribute('role')).toBe('alertdialog');
  });

  it('should inherit attributes when set via htmlAttributes', async () => {
    const page = await newSpecPage({
      components: [Popover],
      template: () => (
        <ion-popover overlayIndex={1} htmlAttributes={{ 'aria-label': 'my label', role: 'alertdialog' }}></ion-popover>
      ),
    });

    const popover = page.body.querySelector('ion-popover')!;
    const content = popover.shadowRoot!.querySelector('[part="content"]')!;

    expect(content.getAttribute('aria-label')).toBe('my label');
    expect(content.getAttribute('role')).toBe('alertdialog');

    expect(popover.hasAttribute('aria-label')).toBe(false);
    expect(popover.hasAttribute('role')).toBe(false);
  });
});
