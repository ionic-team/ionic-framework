import { Component, Listen, Method } from '@stencil/core';
import { ToastEvent, ToastOptions } from '../../index';

@Component({
  tag: 'ion-toast-controller'
})
export class ToastController {
  private ids = 0;
  private toastResolves: { [toastId: string]: Function } = {};
  private toasts: HTMLIonToastElement[] = [];

  @Method()
  create(opts?: ToastOptions): Promise<HTMLIonToastElement> {
    // create ionic's wrapping ion-toast component
    const toast = document.createElement('ion-toast');
    const id = this.ids++;

    // give this toast a unique id
    toast.toastId = `toast-${id}`;
    toast.style.zIndex = (10000 + id).toString();

    // convert the passed in toast options into props
    // that get passed down into the new toast
    Object.assign(toast, opts);

    // append the toast element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(toast as any);

    // store the resolve function to be called later up when the toast loads
    return new Promise<HTMLIonToastElement>(resolve => {
      this.toastResolves[toast.toastId] = resolve;
    });
  }

  @Listen('body:ionToastDidLoad')
  protected didLoad(ev: ToastEvent) {
    const toast = ev.target as HTMLIonToastElement;
    const toastResolve = this.toastResolves[toast.toastId];
    if (toastResolve) {
      toastResolve(toast);
      delete this.toastResolves[toast.toastId];
    }
  }

  @Listen('body:ionToastWillPresent')
  protected willPresent(ev: ToastEvent) {
    this.toasts.push(ev.target as HTMLIonToastElement);
  }

  @Listen('body:ionToastWillDismiss, body:ionToastDidUnload')
  protected willDismiss(ev: ToastEvent) {
    const index = this.toasts.indexOf(ev.target as HTMLIonToastElement);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    const lastToast = this.toasts[this.toasts.length - 1];
    if (lastToast) {
      lastToast.dismiss();
    }
  }
}
