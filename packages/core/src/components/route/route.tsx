import { Component, Method, Prop } from '@stencil/core';
import { RouterEntry, parseURL } from '../router-controller/router-utils';


@Component({
  tag: 'ion-route'
})
export class Route {

  @Prop() path: string;
  @Prop() component: string;
  @Prop() props: any = {};

  @Method()
  getRoute(): RouterEntry {
    return {
      path: this.path,
      segments: parseURL(this.path),
      id: this.component,
      props: this.props
    };
  }
}
