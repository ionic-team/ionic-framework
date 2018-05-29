import { Component, Listen, Method, Prop } from '@stencil/core';
import { ActionSheetOptions } from '../../interface';
import { OverlayController, createOverlay, dismissOverlay, getTopOverlay, removeLastOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-action-sheet-controller'
})
export class ActionSheetController implements OverlayController {

  private actionSheets = new Map<number, HTMLIonActionSheetElement>();

  @Prop({ context: 'document' }) doc!: Document;

  @Listen('body:ionActionSheetWillPresent')
  protected actionSheetWillPresent(ev: any) {
    this.actionSheets.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionActionSheetWillDismiss')
  @Listen('body:ionActionSheetDidUnload')
  protected actionSheetWillDismiss(ev: any) {
    this.actionSheets.delete(ev.target.overlayId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastOverlay(this.actionSheets);
  }

  /*
   * Create an action sheet overlay with action sheet options.
   */
  @Method()
  create(opts?: ActionSheetOptions): Promise<HTMLIonActionSheetElement> {
    return createOverlay(this.doc.createElement('ion-action-sheet'), opts);
  }

  /*
   * Dismiss the open action sheet overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, actionSheetId = -1) {
    return dismissOverlay(data, role, this.actionSheets, actionSheetId);
  }

  /*
   * Get the most recently opened action sheet overlay.
   */
  @Method()
  getTop(): HTMLIonActionSheetElement {
    return getTopOverlay(this.actionSheets);
  }
}
