import { Injectable } from '@angular/core';
import { ModalDismissEvent, ModalOptions } from '@ionic/core';

import { ModalDelegate } from '../types/interfaces';

let modalId = 0;

@Injectable()
export class ModalController {

  public delegate: ModalDelegate;
  create(opts?: ModalOptions): ModalProxy {
    return getModalProxy(opts, this);
  }

}

export function getModalProxy(opts: ModalOptions, modalController: ModalController) {
  return {
    id: modalId++,
    state: PRESENTING,
    opts: opts,
    delegate: modalController.delegate,
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
  return loadOverlay(modalProxy.delegate).then((modalElement: HTMLIonModalElement) => {
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

export function loadOverlay(delegate: ModalDelegate): Promise<HTMLIonModalElement> {

  if (!delegate) {
    console.warn('In order to use the ModalController from @ionic/angular, make sure that an `ion-app` or `ion-modal-container` element are within an Angular template');
    return Promise.reject(new Error('Missing modal delegate'));
  }

  delegate.showModal = true;

  return queryAsync('ion-modal', 30).then((modal: HTMLIonModalElement) => {
    return (modal as any).componentOnReady();
  }).then((modal: HTMLIonModalElement) => {
    const details = modal.getModalWrapperDetails();
    delegate.role = details.role;
    delegate.classes = details.classes;
    return modal;
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
  delegate: ModalDelegate;
}

export const PRESENTING = 1;
export const DISMISSING = 2;

const ION_MODAL_DID_DISMISS_EVENT = 'ionModalDidDismiss';
const ION_MODAL_WILL_DISMISS_EVENT = 'ionModalWillDismiss';


export function queryAsync(selector: string, duration: number): Promise<HTMLIonModalElement> {
  return new Promise((resolve) => {

    function check(callback: Function) {
      setTimeout(() => {
        const modal = document.querySelector(selector);
        console.log('setTimeout: ', modal);
        if (modal && (modal as any).componentOnReady) {
          callback(modal);
        } else {
          check(callback);
        }
      }, duration);
    }

    check(resolve);
  });
}
