import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  Type,
} from '@angular/core';

import {
  FrameworkDelegate,
  ModalDismissEvent,
  ModalOptions
} from '@ionic/core';

import { AngularComponentMounter } from '../providers/angular-component-mounter';
import { AngularMountingData } from '../types/interfaces';

import { ensureElementInBody, hydrateElement } from '../util/util';

let modalId = 0;

@Injectable()
export class ModalController implements FrameworkDelegate {

  constructor(private angularComponentMounter: AngularComponentMounter, private componentResolveFactory: ComponentFactoryResolver, private injector: Injector) {
  }

  create(opts?: ModalOptions): ModalProxy {
    opts.delegate = this;
    return getModalProxy(opts);
  }

  attachViewToDom(elementOrContainerToMountTo: HTMLElement, elementOrComponentToMount: Type<any>, _propsOrDataObj?: any, classesToAdd?: string[]): Promise<AngularMountingData> {

    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo, null, elementOrComponentToMount, this.componentResolveFactory, this.injector, _propsOrDataObj, classesToAdd);
  }

  removeViewFromDom(_parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(childElement);
  }
}

export function getModalProxy(opts: ModalOptions) {
  return {
    id: modalId++,
    state: PRESENTING,
    opts: opts,
    present: function() { return present(this); },
    dismiss: function() { return dismiss(this); },
    onDidDismiss: function(callback: (data: any, role: string) => void) {
      (this as ModalProxyInternal).onDidDismissHandler = callback;
    },
    onWillDismiss: function(callback: (data: any, role: string) => void) {
      (this as ModalProxyInternal).onWillDismissHandler = callback;
    },
  };
}

export function present(modalProxy: ModalProxyInternal): Promise<any> {
  modalProxy.state = PRESENTING;
  return loadOverlay(modalProxy.opts).then((modalElement: HTMLIonModalElement) => {
    Object.assign(modalElement, modalProxy.opts);
    modalProxy.element = modalElement;

    const onDidDismissHandler = (event: ModalDismissEvent) => {
      modalElement.removeEventListener(ION_MODAL_DID_DISMISS_EVENT, onDidDismissHandler);
      if (modalProxy.onDidDismissHandler) {
        modalProxy.onDidDismissHandler(event.detail.data, event.detail.role);
      }
    };

    const onWillDismissHandler = (event: ModalDismissEvent) => {
      modalElement.removeEventListener(ION_MODAL_WILL_DISMISS_EVENT, onWillDismissHandler);
      if (modalProxy.onWillDismissHandler) {
        modalProxy.onWillDismissHandler(event.detail.data, event.detail.role);
      }
    };

    modalElement.addEventListener(ION_MODAL_DID_DISMISS_EVENT, onDidDismissHandler);
    modalElement.addEventListener(ION_MODAL_WILL_DISMISS_EVENT, onWillDismissHandler);

    if (modalProxy.state === PRESENTING) {
      return modalElement.present();
    }

    // we'll only ever get here if someone tried to dismiss the overlay or mess with it's internal state
    // attribute before it could async load and present itself.
    // with that in mind, just return null to make the TS compiler happy
    return null;
  });
}

export function dismiss(modalProxy: ModalProxyInternal): Promise<any> {
  modalProxy.state = DISMISSING;
  if (modalProxy.element) {
    if (modalProxy.state === DISMISSING) {
      return modalProxy.element.dismiss();
    }
  }
  // either we're not in the dismissing state
  // or we're calling this before the element is created
  // so just return a resolved promise
  return Promise.resolve();
}

export function loadOverlay(opts: ModalOptions): Promise<HTMLIonModalElement> {
  const element = ensureElementInBody('ion-modal-controller') as HTMLIonModalControllerElement;
  return hydrateElement(element).then(() => {
    return element.create(opts);
  });
}

export interface ModalProxy {
  present(): Promise<void>;
  dismiss(): Promise<void>;
  onDidDismiss(callback: (data: any, role: string) => void): void;
  onWillDismiss(callback: (data: any, role: string) => void): void;
}

export interface ModalProxyInternal extends ModalProxy {
  id: number;
  opts: ModalOptions;
  state: number;
  element: HTMLIonModalElement;
  onDidDismissHandler?: (data: any, role: string) => void;
  onWillDismissHandler?: (data: any, role: string) => void;
}

export const PRESENTING = 1;
export const DISMISSING = 2;

const ION_MODAL_DID_DISMISS_EVENT = 'ionModalDidDismiss';
const ION_MODAL_WILL_DISMISS_EVENT = 'ionModalWillDismiss';

