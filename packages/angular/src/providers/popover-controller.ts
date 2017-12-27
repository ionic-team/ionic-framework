import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  Type,
} from '@angular/core';

import {
  FrameworkDelegate,
  PopoverDismissEvent,
  PopoverOptions
} from '@ionic/core';

import { AngularComponentMounter } from '../providers/angular-component-mounter';
import { AngularMountingData } from '../types/interfaces';

import { ensureElementInBody, hydrateElement } from '../util/util';

let popoverId = 0;

@Injectable()
export class PopoverController implements FrameworkDelegate {

  constructor(private angularComponentMounter: AngularComponentMounter, private componentResolveFactory: ComponentFactoryResolver, private injector: Injector) {
  }

  create(opts?: PopoverOptions): PopoverProxy {
    opts.delegate = this;
    return getPopoverProxy(opts);
  }

  attachViewToDom(elementOrContainerToMountTo: HTMLElement, elementOrComponentToMount: Type<any>, _propsOrDataObj?: any, classesToAdd?: string[]): Promise<AngularMountingData> {

    const hostElement = document.createElement('div');
    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo, hostElement, elementOrComponentToMount, this.componentResolveFactory, this.injector, _propsOrDataObj, classesToAdd);
  }

  removeViewFromDom(_parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(childElement);
  }
}

export function getPopoverProxy(opts: PopoverOptions) {
  return {
    id: popoverId++,
    state: PRESENTING,
    opts: opts,
    present: function() { return present(this); },
    dismiss: function() { return dismiss(this); },
    onDidDismiss: function(callback: (data: any, role: string) => void) {
      (this as PopoverProxyInternal).onDidDismissHandler = callback;
    },
    onWillDismiss: function(callback: (data: any, role: string) => void) {
      (this as PopoverProxyInternal).onWillDismissHandler = callback;
    },
  };
}

export function present(popoverProxy: PopoverProxyInternal): Promise<any> {
  popoverProxy.state = PRESENTING;
  return loadOverlay(popoverProxy.opts).then((popoverElement: HTMLIonPopoverElement) => {
    Object.assign(popoverElement, popoverProxy.opts);
    popoverProxy.element = popoverElement;

    const onDidDismissHandler = (event: PopoverDismissEvent) => {
      popoverElement.removeEventListener(ION_POPOVER_DID_DISMISS_EVENT, onDidDismissHandler);
      if (popoverProxy.onDidDismissHandler) {
        popoverProxy.onDidDismissHandler(event.detail.data, event.detail.role);
      }
    };

    const onWillDismissHandler = (event: PopoverDismissEvent) => {
      popoverElement.removeEventListener(ION_POPOVER_WILL_DISMISS_EVENT, onWillDismissHandler);
      if (popoverProxy.onWillDismissHandler) {
        popoverProxy.onWillDismissHandler(event.detail.data, event.detail.role);
      }
    };

    popoverElement.addEventListener(ION_POPOVER_DID_DISMISS_EVENT, onDidDismissHandler);
    popoverElement.addEventListener(ION_POPOVER_WILL_DISMISS_EVENT, onWillDismissHandler);

    if (popoverProxy.state === PRESENTING) {
      return popoverElement.present();
    }

    // we'll only ever get here if someone tried to dismiss the overlay or mess with it's internal state
    // attribute before it could async load and present itself.
    // with that in mind, just return null to make the TS compiler happy
    return null;
  });
}

export function dismiss(popoverProxy: PopoverProxyInternal): Promise<any> {
  popoverProxy.state = DISMISSING;
  if (popoverProxy.element) {
    if (popoverProxy.state === DISMISSING) {
      return popoverProxy.element.dismiss();
    }
  }
  // either we're not in the dismissing state
  // or we're calling this before the element is created
  // so just return a resolved promise
  return Promise.resolve();
}

export function loadOverlay(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
  const element = ensureElementInBody('ion-popover-controller') as HTMLIonPopoverControllerElement;
  return hydrateElement(element).then(() => {
    return element.create(opts);
  });
}

export interface PopoverProxy {
  present(): Promise<void>;
  dismiss(): Promise<void>;
  onDidDismiss(callback: (data: any, role: string) => void): void;
  onWillDismiss(callback: (data: any, role: string) => void): void;
}

export interface PopoverProxyInternal extends PopoverProxy {
  id: number;
  opts: PopoverOptions;
  state: number;
  element: HTMLIonPopoverElement;
  onDidDismissHandler?: (data: any, role: string) => void;
  onWillDismissHandler?: (data: any, role: string) => void;
}

export const PRESENTING = 1;
export const DISMISSING = 2;

const ION_POPOVER_DID_DISMISS_EVENT = 'ionPopoverDidDismiss';
const ION_POPOVER_WILL_DISMISS_EVENT = 'ionPopoverWillDismiss';

