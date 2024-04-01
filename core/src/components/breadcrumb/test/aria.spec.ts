import { newSpecPage } from '@stencil/core/testing';

import { Breadcrumb } from '../breadcrumb';

describe('breadcrumb: collapsed indicator', () => {
  it('should have an aria-label', async () => {
    const page = await newSpecPage({
      components: [Breadcrumb],
      /**
       * `showCollapsedIndicator` is an internal API used by `ion-breadcrumbs`.
       * This test makes use of it to render the collapsed indicator.
       */
      html: `<ion-breadcrumb show-collapsed-indicator="true">Text</ion-breadcrumb>`,
    });

    const collapsedIndicator = page.body
      .querySelector('ion-breadcrumb')!
      .shadowRoot!.querySelector(
        '.breadcrumbs-collapsed-indicator'
      )!;
    const ariaLabel =
      collapsedIndicator.getAttribute(
        'aria-label'
      );

    expect(ariaLabel).toEqual(
      'Show more breadcrumbs'
    );
  });
});
