import { Component, Event, Prop } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

@Component({
  tag: 'ion-route'
})
export class Route {

  @Prop() url = '';
  @Prop() component: string;
  @Prop() componentProps: {[key: string]: any};

  @Event() ionRouteDataChanged: EventEmitter;

  componentDidLoad() {
    this.ionRouteDataChanged.emit();
  }
  componentDidUnload() {
    this.ionRouteDataChanged.emit();
  }
  componentDidUpdate() {
    this.ionRouteDataChanged.emit();
  }
}
