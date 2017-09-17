
import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { Nav, NavContainer, OverlayPortal } from '../../navigation/nav-interfaces';

@Component({
  tag: 'ion-overlay-portal'
})
export class IonOverlayPortal implements NavContainer, OverlayPortal {

  id: number;
  name: string;
  parent: Nav;

  @Element() element: HTMLElement;
  @Prop() type: string;
  @Event() registerPortal: EventEmitter;

  getActiveChildNavs(): NavContainer[] {
    throw new Error('Method not implemented.');
  }

  getAllChildNavs?(): NavContainer[] {
    throw new Error('Method not implemented.');
  }

  getType(): string {
    return 'portal';
  }

  getSecondaryIdentifier(): string {
    return null;
  }

  componentWillLoad() {
    componentWillLoadImpl(this);
  }

  render() {
    return <slot></slot>;
  }
}

export function componentWillLoadImpl(overlayPortal: OverlayPortal) {
  overlayPortal.registerPortal.emit(overlayPortal);
}
