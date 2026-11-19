import { newSpecPage } from '@stencil/core/testing';

import { RouteRedirect } from '../route-redirect';

describe('route-redirect', () => {
  it('should render with a shadow root', async () => {
    const page = await newSpecPage({
      components: [RouteRedirect],
      html: `<ion-route-redirect from="/home" to="/"></ion-route-redirect>`,
    });

    expect(page.body.querySelector('ion-route-redirect')!.shadowRoot).not.toBeNull();
  });
});
