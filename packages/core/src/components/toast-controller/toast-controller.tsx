import { Component, Listen, Method } from '@stencil/core';
import { ToastEvent, ToastOptions, Toast } from '../../index';

@Component({
  tag: 'ion-toast-controller'
})
export class ToastController {
  private ids = 0;
  private toastResolves: { [toastId: string]: Function } = {};
  private toasts: Toast[] = [];

  @Method()
  create(opts?: ToastOptions) {
    // create ionic's wrapping ion-toast component
    const toast = document.createElement('ion-toast');
    const id = this.ids++;

    // give this toast a unique id
    toast.id = `toast-${id}`;
    toast.style.zIndex = (10000 + id).toString();

    // convert the passed in toast options into props
    // that get passed down into the new toast
    Object.assign(toast, opts);

    // append the toast element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(toast as any);

    // store the resolve function to be called later up when the toast loads
    return new Promise<Toast>(resolve => {
      this.toastResolves[toast.id] = resolve;
    });
  }

  @Listen('body:ionToastDidLoad')
  protected viewDidLoad(ev: ToastEvent) {
    const toast = ev.detail.toast;
    const toastResolve = this.toastResolves[toast.id];
    if (toastResolve) {
      toastResolve(toast);
      delete this.toastResolves[toast.id];
    }
  }

  @Listen('body:ionToastWillPresent')
  protected willPresent(ev: ToastEvent) {
    this.toasts.push(ev.detail.toast);
  }

  @Listen('body:ionToastWillDismiss, body:ionToastDidUnload')
  protected willDismiss(ev: ToastEvent) {
    const index = this.toasts.indexOf(ev.detail.toast);
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
