import { Component, Listen, Method } from '@stencil/core';
import { PopoverEvent, PopoverOptions } from '../../index';

let ids = 0;
const popovers = new Map<number, HTMLIonPopoverElement>();

@Component({
  tag: 'ion-popover-controller'
})
export class PopoverController {

  @Method()
  create(opts?: PopoverOptions): Promise<HTMLIonPopoverElement> {
    // create ionic's wrapping ion-popover component
    const popoverElement = document.createElement('ion-popover');

    // give this popover a unique id
    popoverElement.popoverId = ids++;

    // convert the passed in popover options into props
    // that get passed down into the new popover
    Object.assign(popoverElement, opts);

    // append the popover element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(popoverElement);

    return (popoverElement as any).componentOnReady();
  }

  @Method()
  dismiss(data?: any, role?: any, popoverId = -1) {
    popoverId = popoverId >= 0 ? popoverId : getHighestId();
    const popover = popovers.get(popoverId);
    if (!popover) {
      return Promise.reject('popover does not exist');
    }
    return popover.dismiss(data, role);
  }


  @Listen('body:ionPopoverWillPresent')
  protected popoverWillPresent(ev: PopoverEvent) {
    popovers.set(ev.target.popoverId, ev.target);
  }


  @Listen('body:ionPopoverWillDismiss, body:ionPopoverDidUnload')
  protected popoverWillDismiss(ev: PopoverEvent) {
    popovers.delete(ev.target.popoverId);
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastPopover();
  }
}

function getHighestId() {
  let minimum = -1;
  popovers.forEach((_popover: HTMLIonPopoverElement, id: number) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

function removeLastPopover() {
  const toRemove = popovers.get(getHighestId());
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}
