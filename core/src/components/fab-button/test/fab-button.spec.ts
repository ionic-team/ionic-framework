import { newSpecPage } from '@stencil/core/testing';

import { FabButton } from '../fab-button';

describe('fab-button: aria attributes', () => {
  it('should inherit aria attributes to inner <button>', async () => {
    const page = await newSpecPage({
      components: [FabButton],
      html: `
        <ion-fab-button aria-label="Hello World">My Button</ion-fab-button>
      `,
    });

    const fabButton = page.body.querySelector('ion-fab-button');
    const root = fabButton.shadowRoot;
    const nativeButton = root.querySelector('button');
    expect(nativeButton.getAttribute('aria-label')).toEqual('Hello World');
  });
});
