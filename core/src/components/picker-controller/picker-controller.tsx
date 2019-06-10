import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { OverlayController, PickerOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-picker-controller'
})
export class PickerController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create a picker overlay with picker options.
   *
   * @param options The options to use to create the picker.
   */
  @Method()
  create(options: PickerOptions): Promise<HTMLIonPickerElement> {
    return createOverlay(this.doc.createElement('ion-picker'), options);
  }

  /**
   * Dismiss the open picker overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the picker.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the picker.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the picker to dismiss. If an id is not provided, it will dismiss the most recently opened picker.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'ion-picker', id);
  }

  /**
   * Get the most recently opened picker overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonPickerElement | undefined> {
    return getOverlay(this.doc, 'ion-picker') as HTMLIonPickerElement;
  }
}
