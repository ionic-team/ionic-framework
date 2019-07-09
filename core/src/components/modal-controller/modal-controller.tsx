import { Component, ComponentInterface, Method, writeTask } from '@stencil/core';

import { ComponentRef, ModalOptions, OverlayController } from '../../interface';
import { GestureDetail } from '../../utils/gesture';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-modal-controller'
})
export class ModalController implements ComponentInterface, OverlayController {
  /**
   * Create a modal overlay with modal options.
   *
   * @param options The options to use to create the modal.
   */
  @Method()
  async create<T extends ComponentRef>(options: ModalOptions<T>): Promise<HTMLIonModalElement> {
    const overlay = await createOverlay<HTMLIonModalElement>('ion-modal', options);

    if (options.swipeToClose) {
      this.createSwipeToCloseGesture(overlay);
    }

    return Promise.resolve(overlay);
  }

  /**
   * Dismiss the open modal overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the modal.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'ion-modal', id);
  }

  /**
   * Get the most recently opened modal overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonModalElement | undefined> {
    return getOverlay(document, 'ion-modal') as HTMLIonModalElement;
  }

  private async createSwipeToCloseGesture(modal: HTMLIonModalElement) {
    const gesture = (await import('../../utils/gesture')).createGesture({
      el: modal,
      gestureName: 'modalSwipeToClose',
      gesturePriority: 110,
      threshold: 0,
      direction: 'y',
      passive: false,
      canStart: detail => this.swipeToCloseCanStart(modal, detail),
      onStart: detail => this.swipeToCloseOnStart(modal, detail),
      onMove: detail => this.swipeToCloseOnMove(modal, detail),
      onEnd: detail => this.swipeToCloseOnEnd(modal, detail)
    });

    gesture.setDisabled(false);
  }

  private swipeToCloseCanStart(_modal: HTMLIonModalElement, detail: GestureDetail) {
    console.log('Can start', detail);
    return true;
  }

  private swipeToCloseOnStart(_modal: HTMLIonModalElement, detail: GestureDetail) {
    console.log('On start', detail);
    this.swipeDisableTransition();
  }

  private swipeToCloseOnMove(modal: HTMLIonModalElement, detail: GestureDetail) {
    console.log('On move', detail);

    const wrapper = modal.querySelector('.modal-wrapper') as HTMLDivElement;

    const y = detail.deltaY;

    writeTask(() => {
      wrapper.style.transform = `translateY(${y}px)`;
    });
  }

  private swipeToCloseOnEnd(_modal: HTMLIonModalElement, detail: GestureDetail) {
    console.log('On end', detail);
  }

  private swipeDisableTransition() {
    console.log('Disabling transition');
  }
}
