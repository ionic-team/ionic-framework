import { Component, Listen, Method } from '@stencil/core';
import { ActionSheet, ActionSheetEvent, ActionSheetOptions  } from '../../index';


@Component({
  tag: 'ion-action-sheet-controller'
})
export class ActionSheetController {
  private ids = 0;
  private actionSheetResolves: { [actionSheetId: string]: Function } = {};
  private actionSheets: ActionSheet[] = [];

  @Method()
  create(opts?: ActionSheetOptions) {
    // create ionic's wrapping ion-action-sheet component
    const actionSheet = document.createElement('ion-action-sheet');

    const id = this.ids++;

    // give this action sheet a unique id
    actionSheet.id = `action-sheet-${id}`;
    actionSheet.style.zIndex = (20000 + id).toString();

    // convert the passed in action sheet options into props
    // that get passed down into the new action sheet
    Object.assign(actionSheet, opts);

    // append the action sheet element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(actionSheet as any);

    // store the resolve function to be called later up when the action sheet loads
    return new Promise<ActionSheet>(resolve => {
      this.actionSheetResolves[actionSheet.id] = resolve;
    });
  }

  @Listen('body:ionActionSheetDidLoad')
  protected viewDidLoad(ev: ActionSheetEvent) {
    const actionSheet = ev.detail.actionSheet;
    const actionSheetResolve = this.actionSheetResolves[actionSheet.id];
    if (actionSheetResolve) {
      actionSheetResolve(actionSheet);
      delete this.actionSheetResolves[actionSheet.id];
    }
  }

  @Listen('body:ionActionSheetWillPresent')
  protected willPresent(ev: ActionSheetEvent) {
    this.actionSheets.push(ev.detail.actionSheet);
  }

  @Listen('body:ionActionSheetWillDismiss, body:ionActionSheetDidUnload')
  protected willDismiss(ev: ActionSheetEvent) {
    const index = this.actionSheets.indexOf(ev.detail.actionSheet);
    if (index > -1) {
      this.actionSheets.splice(index, 1);
    }
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    const lastActionSheet = this.actionSheets[this.actionSheets.length - 1];
    if (lastActionSheet) {
      lastActionSheet.dismiss();
    }
  }
}
