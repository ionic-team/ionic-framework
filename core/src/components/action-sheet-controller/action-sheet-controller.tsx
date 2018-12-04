import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { ActionSheetOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-action-sheet-controller'
})
export class ActionSheetController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create an action sheet overlay with action sheet options.
   */
  @Method()
  create(opts: ActionSheetOptions): Promise<HTMLIonActionSheetElement> {
    return createOverlay(this.doc.createElement('ion-action-sheet'), opts);
  }

  /**
   * Dismiss the open action sheet overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'ion-action-sheet', id);
  }

  /**
   * Get the most recently opened action sheet overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonActionSheetElement | undefined> {
    return getOverlay(this.doc, 'ion-action-sheet') as HTMLIonActionSheetElement;
  }
}
