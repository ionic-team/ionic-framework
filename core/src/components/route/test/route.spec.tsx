import { newSpecPage } from '@stencil/core/testing';

import { Route } from '../route';

describe('route', () => {
  it('should render with a shadow root', async () => {
    const page = await newSpecPage({
      components: [Route],
      html: `<ion-route url="/" component="page-one"></ion-route>`,
    });

    expect(page.body.querySelector('ion-route')!.shadowRoot).not.toBeNull();
  });
});
