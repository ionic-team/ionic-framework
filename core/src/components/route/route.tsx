import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-route'
})
export class Route {
  @Prop() url = '';
  @Prop() component: string;
  @Prop() redirectTo: string;
  @Prop() componentProps: {[key: string]: any};
}
