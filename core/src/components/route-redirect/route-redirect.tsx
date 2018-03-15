import { Component, Event, Prop } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

@Component({
  tag: 'ion-route-redirect'
})
export class RouteRedirect {

  @Prop() from = '';
  @Prop() to: string;

  @Event() ionRouteRedirectChanged: EventEmitter;

  componentDidLoad() {
    this.ionRouteRedirectChanged.emit();
  }
  componentDidUnload() {
    this.ionRouteRedirectChanged.emit();
  }
  componentDidUpdate() {
    this.ionRouteRedirectChanged.emit();
  }
}
