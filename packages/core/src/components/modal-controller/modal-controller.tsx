import { Component, Listen, Method } from '@stencil/core';
import { Modal, ModalEvent, ModalOptions } from '../../index';


@Component({
  tag: 'ion-modal-controller'
})
export class ModalController {
  private ids = 0;
  private modalResolves: {[modalId: string]: Function} = {};
  private modals: HTMLIonModalElement[] = [];


  @Method()
  create(opts?: ModalOptions): Promise<HTMLIonModalElement> {
    // create ionic's wrapping ion-modal component
    const modal = document.createElement('ion-modal');

    const id = this.ids++;

    // give this modal a unique id
    modal.modalId = `modal-${id}`;
    modal.style.zIndex = (10000 + id).toString();

    // convert the passed in modal options into props
    // that get passed down into the new modal
    Object.assign(modal, opts);

    // append the modal element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(modal as any);

    // store the resolve function to be called later up when the modal loads
    return new Promise<HTMLIonModalElement>(resolve => {
      this.modalResolves[modal.modalId] = resolve;
    });
  }


  @Listen('body:ionModalDidLoad')
  protected modalDidLoad(ev: ModalEvent) {
    const modal = ev.target as HTMLIonModalElement;
    const modalResolve = this.modalResolves[modal.modalId];
    if (modalResolve) {
      modalResolve(modal);
      delete this.modalResolves[modal.modalId];
    }
  }


  @Listen('body:ionModalWillPresent')
  protected modalWillPresent(ev: ModalEvent) {
    this.modals.push(ev.target as HTMLIonModalElement);
  }


  @Listen('body:ionModalWillDismiss, body:ionModalDidUnload')
  protected modalWillDismiss(ev: ModalEvent) {
    const index = this.modals.indexOf(ev.target as HTMLIonModalElement);
    if (index > -1) {
      this.modals.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    const lastModal = this.modals[this.modals.length - 1];
    if (lastModal) {
      lastModal.dismiss();
    }
  }

}
