import { Component, Listen, Method } from '@stencil/core';
import { ActionSheetEvent, ActionSheetOptions  } from '../../index';

@Component({
  tag: 'ion-action-sheet-controller'
})
export class ActionSheetController {
  private ids = 0;
  private actionSheetResolves: { [actionSheetId: string]: Function } = {};
  private actionSheets: HTMLIonActionSheetElement[] = [];

  /**
   * Open an action-sheet with a title, subTitle, and an array of buttons
   * @param {ActionSheetOptions} opts Action sheet options
   */
  @Method()
  create(opts?: ActionSheetOptions): Promise<HTMLIonActionSheetElement> {
    // create ionic's wrapping ion-action-sheet component
    const actionSheet = document.createElement('ion-action-sheet');

    const id = this.ids++;

    // give this action sheet a unique id
    actionSheet.actionSheetId = `action-sheet-${id}`;

    // convert the passed in action sheet options into props
    // that get passed down into the new action sheet
    Object.assign(actionSheet, opts);

    // append the action sheet element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(actionSheet as any);

    // store the resolve function to be called later up when the action sheet loads
    return new Promise((resolve) => {
      this.actionSheetResolves[actionSheet.actionSheetId] = resolve;
    });
  }

  @Listen('body:ionActionSheetDidLoad')
  protected didLoad(ev: ActionSheetEvent) {
    const actionSheet = ev.target as HTMLIonActionSheetElement;
    const actionSheetResolve = this.actionSheetResolves[actionSheet.actionSheetId];
    if (actionSheetResolve) {
      actionSheetResolve(actionSheet);
      delete this.actionSheetResolves[actionSheet.actionSheetId];
    }
  }

  @Listen('body:ionActionSheetWillPresent')
  protected willPresent(ev: ActionSheetEvent) {
    this.actionSheets.push(ev.target as HTMLIonActionSheetElement);
  }

  @Listen('body:ionActionSheetWillDismiss, body:ionActionSheetDidUnload')
  protected willDismiss(ev: ActionSheetEvent) {
    const index = this.actionSheets.indexOf(ev.target as HTMLIonActionSheetElement);
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
