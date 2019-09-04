import { Build, Component, ComponentInterface, Method } from '@stencil/core';

import { ComponentRef, ModalOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay, getOverlays } from '../../utils/overlays';

/**
 * @deprecated Use the `modalController` exported from core.
 */
@Component({
  tag: 'ion-modal-controller'
})
export class ModalController implements ComponentInterface, OverlayController {
  modals: HTMLIonModalElement[] = [];

  constructor() {
    if (Build.isDev) {
      console.warn(`[DEPRECATED][ion-modal-controller] Use the modalController export from @ionic/core:
  import { modalController } from '@ionic/core';
  const modal = await modalController.create({...});`);
    }
  }

  /**
   * Create a modal overlay with modal options.
   *
   * @param options The options to use to create the modal.
   */
  @Method()
  async create<T extends ComponentRef>(options: ModalOptions<T>): Promise<HTMLIonModalElement> {
    console.log('Creating modal', options);
    const modal = await createOverlay<HTMLIonModalElement>('ion-modal', options);

    console.log(getOverlays(document, 'ion-modal'));
    this.modals.push(modal);
    return modal;
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

}
