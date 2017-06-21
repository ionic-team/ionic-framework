import { Component, Ionic, Listen } from '../index';
import { GlobalNamespace, ModalEvent, ModalOptions, Modal, IonicControllerApi } from '../../util/interfaces';


@Component({
  tag: 'ion-modal-controller',
  styleUrls: 'modal-controller.scss'
})
export class ModalController implements IonicControllerApi {
  private ids = 0;
  private modalResolves: {[modalId: string]: Function} = {};
  private modals: Modal[] = [];
  private appRoot: Element;


  ionViewDidLoad() {
    this.appRoot = document.querySelector('ion-app') || document.body;
    (<GlobalNamespace>Ionic).loadController('modal', this);
  }


  load(opts?: ModalOptions) {
    // create ionic's wrapping ion-modal component
    const modal: Modal = document.createElement<any>('ion-modal');

    const id = this.ids++;

    // give this modal a unique id
    modal.id = `modal-${id}`;
    modal.style.zIndex = (10000 + id);

    // convert the passed in modal options into props
    // that get passed down into the new modal
    Object.assign(modal, opts);

    // append the modal element to the document body
    this.appRoot.appendChild(<any>modal);

    // store the resolve function to be called later up when the modal loads
    return new Promise<Modal>(resolve => {
      this.modalResolves[modal.id] = resolve;
    });
  }


  @Listen('body:ionModalDidLoad')
  viewDidLoad(ev: ModalEvent) {
    const modal = ev.detail.modal;
    const modalResolve = this.modalResolves[modal.id];
    if (modalResolve) {
      modalResolve(modal);
      delete this.modalResolves[modal.id];
    }
  }


  @Listen('body:ionModalWillPresent')
  willPresent(ev: ModalEvent) {
    this.modals.push(ev.detail.modal);
  }


  @Listen('body:ionModalWillDismiss, body:ionModalDidUnload')
  willDismiss(ev: ModalEvent) {
    const index = this.modals.indexOf(ev.detail.modal);
    if (index > -1) {
      this.modals.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  escapeKeyUp() {
    const lastModal = this.modals[this.modals.length - 1];
    if (lastModal) {
      lastModal.dismiss();
    }
  }

}
