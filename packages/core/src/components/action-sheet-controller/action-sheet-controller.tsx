import { Component, Listen, Method } from '@stencil/core';
import { ActionSheetEvent, ActionSheetOptions  } from '../../index';


/**
 * @name ActionSheetController
 * @description
 * An Action Sheet is a dialog that lets the user choose from a set of
 * options. It appears on top of the app's content, and must be manually
 * dismissed by the user before they can resume interaction with the app.
 * Dangerous (destructive) options are made obvious in `ios` mode. There are easy
 * ways to cancel out of the action sheet, such as tapping the backdrop or
 * hitting the escape key on desktop.
 *
 * An action sheet is created from an array of `buttons`, with each button
 * including properties for its `text`, and optionally a `handler` and `role`.
 * If a handler returns `false` then the action sheet will not be dismissed. An
 * action sheet can also optionally have a `title`, `subTitle` and an `icon`.
 *
 * A button's `role` property can either be `destructive` or `cancel`. Buttons
 * without a role property will have the default look for the platform. Buttons
 * with the `cancel` role will always load as the bottom button, no matter where
 * they are in the array. All other buttons will be displayed in the order they
 * have been added to the `buttons` array. Note: We recommend that `destructive`
 * buttons are always the first button in the array, making them the top button.
 * Additionally, if the action sheet is dismissed by tapping the backdrop, then
 * it will fire the handler from the button with the cancel role.
 *
 * You can pass all of the action sheet's options in the first argument of
 * the create method: `ActionSheet.create(opts)`.
 */
@Component({
  tag: 'ion-action-sheet-controller'
})
export class ActionSheetController {
  private ids = 0;
  private actionSheetResolves: { [actionSheetId: string]: Function } = {};
  private actionSheets: HTMLIonActionSheetElement[] = [];

  /**
   * Open an action sheet with a title, subTitle, and an array of buttons
   * @param {ActionSheetOptions} opts Action sheet options
   */
  @Method()
  create(opts?: ActionSheetOptions): Promise<HTMLIonActionSheetElement> {
    // create ionic's wrapping ion-action-sheet component
    const actionSheet = document.createElement('ion-action-sheet');

    const id = this.ids++;

    // give this action sheet a unique id
    actionSheet.actionSheetId = `action-sheet-${id}`;
    actionSheet.style.zIndex = (20000 + id).toString();

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
