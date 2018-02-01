import { Injectable } from '@angular/core';

import { ActionSheet } from './action-sheet';
import { ActionSheetOptions } from './action-sheet-options';
import { App } from '../app/app';
import { Config } from '../../config/config';

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
 * the create method: `ActionSheet.create(opts)`. Otherwise the action sheet's
 * instance has methods to add options, like `setTitle()` or `addButton()`.
 *
 * @usage
 * ```ts
 * import { ActionSheetController } from 'ionic-angular'
 *
 * export class MyClass{
 *
 *  constructor(public actionSheetCtrl: ActionSheetController) { }
 *
 *  presentActionSheet() {
 *    const actionSheet = this.actionSheetCtrl.create({
 *      title: 'Modify your album',
 *      buttons: [
 *        {
 *          text: 'Destructive',
 *          role: 'destructive',
 *          handler: () => {
 *            console.log('Destructive clicked');
 *          }
 *        },
 *        {
 *          text: 'Archive',
 *          handler: () => {
 *            console.log('Archive clicked');
 *          }
 *        },
 *        {
 *          text: 'Cancel',
 *          role: 'cancel',
 *          handler: () => {
 *            console.log('Cancel clicked');
 *          }
 *        }
 *      ]
 *    });
 *
 *    actionSheet.present();
 *  }
 * }
 * ```
 *
 * @advanced
 *
 * ActionSheet create options
 *
 * | Option                | Type       | Description                                                        |
 * |-----------------------|------------|--------------------------------------------------------------------|
 * | title                 |`string`    | The title for the Action Sheet.                                    |
 * | subTitle              |`string`    | The sub-title for the Action Sheet.                                |
 * | cssClass              |`string`    | Additional classes for custom styles, separated by spaces.         |
 * | enableBackdropDismiss |`boolean`   | If the Action Sheet should close when the user taps the backdrop.  |
 * | buttons               |`array<any>`| An array of buttons to display.                                    |
 *
 * ActionSheet button options
 *
 * | Option   | Type     | Description                                                                                                                                      |
 * |----------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
 * | text     | `string` | The buttons text.                                                                                                                                |
 * | icon     | `icon`   | The buttons icons.                                                                                                                               |
 * | handler  | `any`    | An express the button should evaluate.                                                                                                           |
 * | cssClass | `string` | Additional classes for custom styles, separated by spaces.                                                                                       |
 * | role     | `string` | How the button should be displayed, `destructive` or `cancel`. If not role is provided, it will display the button without any additional styles.|
 *
 *
 * ### Dismissing And Async Navigation
 *
 * After an action sheet has been dismissed, the app may need to also transition
 * to another page depending on the handler's logic. However, because multiple
 * transitions were fired at roughly the same time, it's difficult for the
 * nav controller to cleanly animate multiple transitions that may
 * have been kicked off asynchronously. This is further described in the
 * [`Nav Transition Promises`](../../nav/NavController/#nav-transition-promises) section. For action sheets,
 * this means it's best to wait for the action sheet to finish its transition
 * out before starting a new transition on the same nav controller.
 *
 * In the example below, after the button has been clicked, its handler
 * waits on async operation to complete, *then* it uses `pop` to navigate
 * back a page in the same stack. The potential problem is that the async operation
 * may have been completed before the action sheet has even finished its transition
 * out. In this case, it's best to ensure the action sheet has finished its transition
 * out first, *then* start the next transition.
 *
 * ```ts
 * const actionSheet = this.actionSheetCtrl.create({
 *   title: 'Hello',
 *   buttons: [{
 *     text: 'Ok',
 *     handler: () => {
 *       // user has clicked the action sheet button
 *       // begin the action sheet's dimiss transition
 *       let navTransition = actionSheet.dismiss();
 *
 *       // start some async method
 *       someAsyncOperation().then(() => {
 *         // once the async operation has completed
 *         // then run the next nav transition after the
 *         // first transition has finished animating out
 *
 *         navTransition.then(() => {
 *           this.nav.pop();
 *         });
 *       });
 *       return false;
 *     }
 *   }]
 * });
 *
 * actionSheet.present();
 * ```
 *
 * It's important to note that the handler returns `false`. A feature of
 * button handlers is that they automatically dismiss the action sheet when their button
 * was clicked, however, we'll need more control regarding the transition. Because
 * the handler returns `false`, then the action sheet does not automatically dismiss
 * itself. Instead, you now have complete control of when the action sheet has finished
 * transitioning, and the ability to wait for the action sheet to finish transitioning
 * out before starting a new transition.
 *
 *
 * @demo /docs/demos/src/action-sheet/
 * @see {@link /docs/components#action-sheets ActionSheet Component Docs}
 */
@Injectable()
export class ActionSheetController {

  constructor(private _app: App, public config: Config) { }

  /**
   * Open an action sheet with a title, subTitle, and an array of buttons
   * @param {ActionSheetOptions} opts Action sheet options
   */
  create(opts: ActionSheetOptions = {}): ActionSheet {
    return new ActionSheet(this._app, opts, this.config);
  }

}
