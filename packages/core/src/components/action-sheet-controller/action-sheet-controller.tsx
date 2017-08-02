import { Component, Listen } from '@stencil/core';
import { ActionSheetEvent, ActionSheetOptions, ActionSheet, IonicControllerApi } from '../../index';


@Component({
  tag: 'ion-action-sheet-controller',
  styleUrl: 'action-sheet-controller.scss'
})
export class ActionSheetController implements IonicControllerApi {
  private ids = 0;
  private actionsheetResolves: {[actionsheetId: string]: Function} = {};
  private actionsheets: ActionSheet[] = [];
  private appRoot: Element;


  ionViewDidLoad() {
    this.appRoot = document.querySelector('ion-app') || document.body;
    Ionic.loadController('action-sheet', this);
  }


  load(opts?: ActionSheetOptions) {
    // create ionic's wrapping ion-actionsheet component
    const actionsheet = document.createElement('ion-action-sheet');
    const id = this.ids++;

    // give this actionsheet a unique id
    actionsheet.id = `action-sheet-${id}`;
    actionsheet.style.zIndex = (20000 + id).toString();

    // convert the passed in actionsheet options into props
    // that get passed down into the new actionsheet
    Object.assign(actionsheet, opts);

    // append the actionsheet element to the document body
    this.appRoot.appendChild(actionsheet as any);

    // store the resolve function to be called later up when the actionsheet loads
    return new Promise<ActionSheet>(resolve => {
      this.actionsheetResolves[actionsheet.id] = resolve;
    });
  }


  @Listen('body:ionActionSheetDidLoad')
  viewDidLoad(ev) {
    const actionsheet = ev.detail.actionsheet;
    const actionsheetResolve = this.actionsheetResolves[actionsheet.id];
    if (actionsheetResolve) {
      actionsheetResolve(actionsheet);
      delete this.actionsheetResolves[actionsheet.id];
    }
  }


  @Listen('body:ionActionSheetWillPresent')
  willPresent(ev: ActionSheetEvent) {
    this.actionsheets.push(ev.actionsheet);
  }


  @Listen('body:ionActionSheetWillDismiss, body:ionActionSheetDidUnload')
  willDismiss(ev: ActionSheetEvent) {
    const index = this.actionsheets.indexOf(ev.actionsheet);
    if (index > -1) {
      this.actionsheets.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  escapeKeyUp() {
    const lastActionSheet = this.actionsheets[this.actionsheets.length - 1];
    if (lastActionSheet) {
      lastActionSheet.dismiss();
    }
  }

}
