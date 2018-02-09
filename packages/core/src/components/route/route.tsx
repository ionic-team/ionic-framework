import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-route'
})
export class Route {

  @Prop() path: string;
  @Prop() sel: string;
  @Prop() props: any = {};

}
