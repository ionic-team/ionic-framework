import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { RouterEntry, parseURL } from './router-utils';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'ion-route'
})
export class Route {

  @Prop() path: string;
  @Prop() component: string;
  @Prop() props: any = {};

  @Event() ionRouteAdded: EventEmitter<RouterEntry>;
  @Event() ionRouteRemoved: EventEmitter<string>;

  componentDidLoad() {
    this.ionRouteAdded.emit({
      path: this.path,
      segments: parseURL(this.path),
      id: this.component,
      props: this.props
    });
  }

  componentDidUnload() {
    this.ionRouteRemoved.emit(this.path);
  }
}
