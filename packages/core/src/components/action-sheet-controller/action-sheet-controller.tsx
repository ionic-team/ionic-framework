import { Component, Listen, Method } from '@stencil/core';
import { ActionSheetEvent, ActionSheetOptions } from '../../index';

let ids = 0;
const actionSheets = new Map<number, HTMLIonActionSheetElement>();

@Component({
  tag: 'ion-action-sheet-controller'
})
export class ActionSheetController {

  @Method()
  create(opts?: ActionSheetOptions): Promise<HTMLIonActionSheetElement> {
    // create ionic's wrapping ion-actionSheet component
    const actionSheetElement = document.createElement('ion-action-sheet');

    // give this actionSheet a unique id
    actionSheetElement.actionSheetId = ids++;

    // convert the passed in actionSheet options into props
    // that get passed down into the new actionSheet
    Object.assign(actionSheetElement, opts);

    // append the actionSheet element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(actionSheetElement);

    return (actionSheetElement as any).componentOnReady();
  }

  @Method()
  dismiss(data?: any, role?: any, actionSheetId = -1) {
    actionSheetId = actionSheetId >= 0 ? actionSheetId : getHighestId();
    const actionSheet = actionSheets.get(actionSheetId);
    if (!actionSheet) {
      return Promise.reject('action-sheet does not exist');
    }
    return actionSheet.dismiss(data, role);
  }


  @Listen('body:ionActionSheetWillPresent')
  protected actionSheetWillPresent(ev: ActionSheetEvent) {
    actionSheets.set(ev.target.actionSheetId, ev.target);
  }


  @Listen('body:ionActionSheetWillDismiss, body:ionActionSheetDidUnload')
  protected actionSheetWillDismiss(ev: ActionSheetEvent) {
    actionSheets.delete(ev.target.actionSheetId);
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastActionSheet();
  }
}

function getHighestId() {
  let minimum = -1;
  actionSheets.forEach((_actionSheet: HTMLIonActionSheetElement, id: number) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

function removeLastActionSheet() {
  const toRemove = actionSheets.get(getHighestId());
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}
