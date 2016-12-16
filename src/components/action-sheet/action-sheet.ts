import { Injectable } from '@angular/core';

import { ActionSheetCmp } from './action-sheet-component';
import { ActionSheetOptions } from './action-sheet-options';
import { App } from '../app/app';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';

/**
 * @private
 */
export class ActionSheet extends ViewController {
  private _app: App;

  constructor(app: App, opts: ActionSheetOptions) {
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(ActionSheetCmp, opts, null);
    this._app = app;
    this.isOverlay = true;
  }

  /**
   * @private
   */
  getTransitionName(direction: string) {
    let key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} title Action sheet title
   */
  setTitle(title: string) {
    this.data.title = title;
  }

  /**
   * @param {string} subTitle Action sheet subtitle
   */
  setSubTitle(subTitle: string) {
    this.data.subTitle = subTitle;
  }

  /**
   * @param {object} button Action sheet button
   */
  addButton(button: any) {
    this.data.buttons.push(button);
  }

  /**
   * Present the action sheet instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    return this._app.present(this, navOptions);
  }

}


/**
 * @name ActionSheetController
 * @description
 * An Action Sheet opens a dialog that contains buttons on top of the app's content.
 * Each button can be customized, and assigned a handler function that is called when
 * the button is tapped.
 *
 * A user must manually dismiss an Action Sheet, before they can resume interaction 
 * with the app. This is done by tapping one of the Action Sheet's buttons, 
 * tapping the back button (Android), or tapping the background outside the 
 * Action Sheet. To prevent tapping a button from dismissing the Action Sheet,
 * set the handler function for that button to return `false`.
 * 
 * An Action Sheet is defined by creating an instance of ActionSheetController
 * then calling `create(options)` on the instance. Action Sheet options can also
 * be specified at a later time with [instance methods](#instance-members) provided 
 * by ActionSheetController. For a complete list of options see 
 * [ActionSheetController Options](#actionsheetcontroller-options) below.
 *
 * To display an Action Sheet call `present()` on a defined Action Sheet.
 *
 * ### Action Sheet Create Options
 *
 *
 * | Option                | Type          | Description                                                |
 * |-----------------------|---------------|------------------------------------------------------------|
 * | title                 |`string`       | The title for the Action Sheet.                            |
 * | subTitle              |`string`       | The sub-title for the Action Sheet.                        |
 * | cssClass              |`string`       | Additional classes for custom styles, separated by spaces. |
 * | enableBackdropDismiss |`boolean`      | If the Action Sheet should close when the user taps the backdrop. Defaults to true. |
 * | buttons               |`Array<any>`   | An array of [button options](#action-sheet-button-options). Buttons are displayed in the order they are included in the array, except buttons with `role: cancel`, which appear at the button of the Action Sheet. |
 *
 * ### Action Sheet Button Options
 *
 *
 * | Option   | Type     | Description                                                                                                                                      |
 * |----------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
 * | text     | `string` | The button text.                                                                                                                                |
 * | icon     | `icon`   | The button icon.                                                                                                                               |
 * | handler  | `any`    | A callback function to execute when the button is tapped. If the user dismisses the Action Sheet by tapping the background, the handler for the button with `role: cancel` will be executed                                           |
 * | cssClass | `string` | Additional classes for custom styles, separated by spaces.                                                                                       |
 * | role     | `string` | `destructive` or `cancel`. `destructive` styles the button in iOS mode only. It is recommended that `destructive` buttons be included at the start of the `buttons` array. `cancel` styles the button across all platform modes, and places the button at the bottom of the Action Sheet. |
 *
 * @usage
 * ```ts
 * import { ActionSheetController } from 'ionic-angular';
 *
 * export class MyClass{
 *
 *  //create instance of ActionSheetController
 *  constructor(public actionSheetCtrl: ActionSheetController) {}
 *
 *  presentActionSheet() {
 *    let options = {
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
 *    }
 *
 *    // create the Action Sheet
 *    let actionSheet = this.actionSheetCtrl.create(options);
 *
 *    //show the Action Sheet 
 *    actionSheet.present();
 *  }
 * }
 * ```
 *
 * ### Starting Page Transitions in Handler Functions
 *
 * If you want to start a page transition in your app from an Action Sheet button's handler
 * function, it is important to keep in mind that the Action Sheet dismissal and the 
 * page transition occur asynchronously. This may cause unexpected results, such as a 
 * janky page transition, since the page transition animation could start before the 
 * Action Sheet has been fully dismissed from the view.
 * 
 * To prevent this, you should programmatically dismiss the Action Sheet in the button's 
 * handler function using `dismiss()`, which returns a promise. You can then call the page
 * transition when the promise resolves to ensure everything happens in the expected order.
 *
 * Also, the handler function must return `false`. This prevents Ionic from automatically
 * dismissing the Action Sheet once the handler function has finished, which allows us to 
 * manually control the order of events.
 *
 * For example, the following creates an Action Sheet with a 'Transition Me!' button whose 
 * handler function dismisses the Action Sheet, then transitions to the previous page
 * in the app.
 *
 * ```ts
 * let actionSheet = this.actionSheetCtrl.create({
 *   title: 'Hello',
 *   buttons: [{
 *     text: 'Transition Me!',
 *     handler: () => {
 *       // begin the Action Sheet's dimiss transition
 *       let navTransition = actionSheet.dismiss();
 *
 *       // start the page transition when dismissal of
 *       // the Action Sheet is complete
 *       navTransition.then(() => {
 *         this.nav.pop();
 *       });
 *      
 *       // prevent Action Sheet from being dismissed automatically
 *       return false;
 *     }
 *   }]
 * });
 *
 * actionSheet.present();
 * ```
 *
 * @demo /docs/v2/demos/src/action-sheet/
 * @see {@link /docs/v2/components#action-sheets ActionSheet Component Docs}
 */
@Injectable()
export class ActionSheetController {

  constructor(private _app: App) {}

  /**
   * Open an action sheet with a title, subTitle, and an array of buttons
   * @param {ActionSheetOptions} opts Action sheet options
   */
  create(opts: ActionSheetOptions = {}): ActionSheet {
    return new ActionSheet(this._app, opts);
  }

}
