import { Component, Listen, Method } from '@stencil/core';
import { ActionSheetEvent, ActionSheetOptions, OverlayController } from '../../index';
import { createOverlay, getTopOverlay, dismissOverlay, removeLastOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-action-sheet-controller'
})
export class ActionSheetController implements OverlayController {

  private actionSheets = new Map<number, HTMLIonActionSheetElement>();


  @Listen('body:ionActionSheetWillPresent')
  protected actionSheetWillPresent(ev: ActionSheetEvent) {
    this.actionSheets.set(ev.target.overlayId, ev.target);
  }


  @Listen('body:ionActionSheetWillDismiss')
  @Listen('body:ionActionSheetDidUnload')
  protected actionSheetWillDismiss(ev: ActionSheetEvent) {
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
    return createOverlay('ion-action-sheet', opts);
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
  getTop() {
    return getTopOverlay(this.actionSheets);
  }
}
