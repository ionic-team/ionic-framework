import { Component, Listen } from '@stencil/core';
import { PopoverEvent, PopoverOptions, Popover, IonicControllerApi } from '../../index';


@Component({
  tag: 'ion-popover-controller',
  // styleUrl: 'popover-controller.scss'
})
export class PopoverController implements IonicControllerApi {
  private ids = 0;
  private popoverResolves: {[popoverId: string]: Function} = {};
  private popovers: Popover[] = [];
  private appRoot: Element;


  ionViewDidLoad() {
    this.appRoot = document.querySelector('ion-app') || document.body;
    Ionic.loadController('popover', this);
  }


  load(opts?: PopoverOptions) {
    // create ionic's wrapping ion-popover component
    const popover = document.createElement('ion-popover');
    const id = this.ids++;

    // give this popover a unique id
    popover.id = `popover-${id}`;
    popover.style.zIndex = (10000 + id).toString();

    // convert the passed in popover options into props
    // that get passed down into the new popover
    Object.assign(popover, opts);

    // append the popover element to the document body
    this.appRoot.appendChild(popover as any);

    // store the resolve function to be called later up when the popover loads
    return new Promise<Popover>(resolve => {
      this.popoverResolves[popover.id] = resolve;
    });
  }


  @Listen('body:ionPopoverDidLoad')
  viewDidLoad(ev) {
    const popover = ev.detail.popover;
    const popoverResolve = this.popoverResolves[popover.id];
    if (popoverResolve) {
      popoverResolve(popover);
      delete this.popoverResolves[popover.id];
    }
  }


  @Listen('body:ionPopoverWillPresent')
  willPresent(ev: PopoverEvent) {
    this.popovers.push(ev.popover);
  }


  @Listen('body:ionPopoverWillDismiss, body:ionPopoverDidUnload')
  willDismiss(ev: PopoverEvent) {
    const index = this.popovers.indexOf(ev.popover);
    if (index > -1) {
      this.popovers.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  escapeKeyUp() {
    const lastPopover = this.popovers[this.popovers.length - 1];
    if (lastPopover) {
      lastPopover.dismiss();
    }
  }

}
