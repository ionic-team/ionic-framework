import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-route-link'
})
export class RouteLink {
  @Prop() url: string;

  // The instance of the router
  @Prop() router: any;
}
