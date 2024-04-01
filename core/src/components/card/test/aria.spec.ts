import { newSpecPage } from '@stencil/core/testing';

import { Card } from '../card';

describe('card: button', () => {
  it('should reflect aria-label to button', async () => {
    const page = await newSpecPage({
      components: [Card],
      html: `<ion-card button="true" aria-label="Test"></ion-card>`,
    });

    const button = page.body
      .querySelector('ion-card')!
      .shadowRoot!.querySelector(
        'button'
      )!;
    const ariaLabel =
      button.getAttribute('aria-label');

    expect(ariaLabel).toEqual('Test');
  });
});
