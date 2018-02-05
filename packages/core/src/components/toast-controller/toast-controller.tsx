import { Component, Listen, Method } from '@stencil/core';
import { ToastEvent, ToastOptions } from '../../index';

let ids = 0;
const toasts = new Map<number, HTMLIonToastElement>();

@Component({
  tag: 'ion-toast-controller'
})
export class ToastController {

  @Method()
  create(opts?: ToastOptions): Promise<HTMLIonToastElement> {
    // create ionic's wrapping ion-toast component
    const toastElement = document.createElement('ion-toast');

    // give this toast a unique id
    toastElement.toastId = ids++;

    // convert the passed in toast options into props
    // that get passed down into the new toast
    Object.assign(toastElement, opts);

    // append the toast element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(toastElement);

    return (toastElement as any).componentOnReady();
  }

  @Method()
  dismiss(data?: any, role?: any, toastId = -1) {
    toastId = toastId >= 0 ? toastId : getHighestId();
    const toast = toasts.get(toastId);
    if (!toast) {
      return Promise.reject('toast does not exist');
    }
    return toast.dismiss(data, role);
  }


  @Listen('body:ionToastWillPresent')
  protected toastWillPresent(ev: ToastEvent) {
    toasts.set(ev.target.toastId, ev.target);
  }


  @Listen('body:ionToastWillDismiss, body:ionToastDidUnload')
  protected toastWillDismiss(ev: ToastEvent) {
    toasts.delete(ev.target.toastId);
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastToast();
  }
}

function getHighestId() {
  let minimum = -1;
  toasts.forEach((_toast: HTMLIonToastElement, id: number) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

function removeLastToast() {
  const toRemove = toasts.get(getHighestId());
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}
