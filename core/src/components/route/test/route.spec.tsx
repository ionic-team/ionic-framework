import { newSpecPage } from '@stencil/core/testing';

import { RouteRedirect } from '../../route-redirect/route-redirect';
import { readRedirects, readRouteNodes } from '../../router/utils/parser';
import { Route } from '../route';

describe('route', () => {
  it('should render with a shadow root', async () => {
    const page = await newSpecPage({
      components: [Route, RouteRedirect],
      html: `
        <ion-route url="/" component="page-one"></ion-route>
        <ion-route-redirect from="/home" to="/"></ion-route-redirect>
      `,
    });

    expect(page.body.querySelector('ion-route')!.shadowRoot).not.toBeNull();
    expect(page.body.querySelector('ion-route-redirect')!.shadowRoot).not.toBeNull();
  });

  /**
   * The router reads nested routes from the light DOM children of each
   * route, so they must stay readable when the routes are shadow components.
   */
  it('should read nested routes and redirects', async () => {
    const page = await newSpecPage({
      components: [Route, RouteRedirect],
      html: `
        <div id="root">
          <ion-route-redirect from="/home" to="/"></ion-route-redirect>
          <ion-route url="/" component="tabs-page">
            <ion-route url="/one" component="tab-one"></ion-route>
            <ion-route url="/two" component="tab-two">
              <ion-route url="/details" component="page-details"></ion-route>
            </ion-route>
          </ion-route>
        </div>
      `,
    });

    const root = page.body.querySelector('#root')!;

    expect(readRedirects(root)).toEqual([{ from: ['home'], to: { segments: [''] } }]);
    expect(readRouteNodes(root)).toEqual([
      {
        segments: [''],
        id: 'tabs-page',
        params: undefined,
        beforeEnter: undefined,
        beforeLeave: undefined,
        children: [
          {
            segments: ['one'],
            id: 'tab-one',
            params: undefined,
            beforeEnter: undefined,
            beforeLeave: undefined,
            children: [],
          },
          {
            segments: ['two'],
            id: 'tab-two',
            params: undefined,
            beforeEnter: undefined,
            beforeLeave: undefined,
            children: [
              {
                segments: ['details'],
                id: 'page-details',
                params: undefined,
                beforeEnter: undefined,
                beforeLeave: undefined,
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });
});
