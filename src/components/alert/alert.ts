import { Injectable } from '@angular/core';

import { App } from '../app/app';
import { AlertCmp } from './alert-component';
import { AlertOptions, AlertInputOptions } from './alert-options';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';


/**
 * @name Alert
 * @description
 * An Alert is a dialog that  opens a dialog on top of the app's content that may
 * contain buttons, inputs, and text. Alerts are commonly used to present the user 
 * with information or to prompt the user to provide information or make a selection.
 *
 * ### Creating an Alert
 *
 * An Alert is defined by importing and creating an instance of AlertController
 * then calling `create(options)` on the instance. Alert options can also
 * be specified at a later time with [instance methods](#instance-members).
 * For a complete list of options see [Alert Options](#alert-options) below.
 *
 * To display an Alert call `present()` on a defined Alert. 
 *
 * ### Dismissing an Alert
 *
 * A user must manually dismiss an Alert before they can resume interaction 
 * with the app. This is done by tapping one of the Alert's buttons, 
 * tapping the back button (Android), or tapping the background outside the 
 * Alert. To prevent tapping a button from dismissing the Alert,
 * set the handler function for that button to return `false`.
 *   
 *
 * ### Handling User Input
 *
 * Alerts can include several different types of inputs, including text, radio
 * buttons, and checkboxes, whose data can be passed back to the app. Only one
 * type of Input is allowed per Alert; however, different types of text inputs 
 * can be mixed, such as `url`, `email`, `text`, etc. 
 *
 * If you require a complex form UI which doesn't fit within the guidelines of
 * an alert, it is recommended that you create a form inside a Modal instead.
 *
 * The user's input will be passed as an argument to the handler function that's 
 * called when the Alert is dismissed. For example, the following handler function
 * will set `userInput` on the model of our component:
 *
 * ```
 * handler: inputResult => {
 *   this.userInput = inputResult;
 * }
 * ```
 *
 * @usage
 * ```ts
 * constructor(private alertCtrl: AlertController) {
 *
 * }
 *
 * presentAlert() {
 *   let options = {
 *     title: 'Low battery',
 *     subTitle: '10% of battery remaining',
 *     buttons: [{
 *       text: 'Cancel',
 *       role: 'cancel',
 *       handler: () => {
 *         console.log('Cancel clicked');
 *       }
 *     },
 *     {
 *       text: 'OK',
 *       handler: () => {
 *         console.log('Buy clicked');
 *       }
 *     }]
 *   }
 *   let alert = this.alertCtrl.create(options);
 *   alert.present();
 * }
 *
 * ```
 *
 * ### Alert options
 *
 * | Property              | Type      | Description                                                               |
 * |-----------------------|-----------|---------------------------------------------------------------------------|
 * | title                 | `string`  | The title for the alert.                                                  |
 * | subTitle              | `string`  | The subtitle for the alert.                                               |
 * | message               | `string`  | The message for the alert.                                                |
 * | cssClass              | `string`  | Additional classes for custom styles, separated by spaces.                |
 * | inputs                | `Array`   | An array of inputs for the alert. See [Input Options](#input-options).    |
 * | buttons               | `Array`   | An array of buttons for the alert. See [Button Options](#button-options). |
 * | enableBackdropDismiss | `boolean` | Whether the alert will be dismissed when the background is tapped.        |
 *
 * ### Input options
 *
 * | Property    | Type      | Description                                                                        |
 * |-------------|-----------|------------------------------------------------------------------------------------|
 * | type        | `string`  | The type of input - text, radio, checkbox, tel, number, etc.                       |
 * | name        | `string`  | The name for the input.                                                            |
 * | placeholder | `string`  | The input's placeholder (for textual/numeric inputs)                               |
 * | value       | `string`  | The input's value. This will be passed to the handler when the Alert is dismissed. |
 * | label       | `string`  | The input's label (only for radio/checkbox inputs)                                 |
 * | checked     | `boolean` | Whether or not the input is checked by default.                                    |
 * | id          | `string`  | The input's id.                                                                    |
 *
 * ### Button options
 *
 * | Property | Type     | Description                                                     |
 * |----------|----------|-----------------------------------------------------------------|
 * | text     | `string` | The buttons displayed text.                                     |
 * | handler  | `any`    | A callback function that is executed when the button is pressed.|
 * | cssClass | `string` | An additional CSS class for the button.                         |
 * | role     | `string` | The buttons role - `null` or `cancel`.                          |
 *
 *
 * @advanced
 * ### Starting Page Transitions in Handler Functions
 *
 * If you want to start a page transition in your app from an Alert button's handler
 * function, it is important to keep in mind that the Alert dismissal and the 
 * page transition occur asynchronously. This may cause unexpected results, such as a 
 * janky page transition, since the page transition animation could start before the 
 * Alert has been fully dismissed from the view.
 * 
 * To prevent this, you should programmatically dismiss the Alert in the button's 
 * handler function using `dismiss()`, which returns a promise. You can then call the page
 * transition when the promise resolves to ensure everything happens in the expected order.
 *
 * Also, the handler function must return `false`. This prevents Ionic from automatically
 * dismissing the Alert once the handler function has finished, which allows us to 
 * manually control the order of events.
 *
 * For example, the following creates an Alert with a 'Transition Me!' button whose 
 * handler function dismisses the Alert, then transitions to the previous page
 * in the app.
 *
 * ```ts
 * let alert = this.alertCtrl.create({
 *   title: 'Hello',
 *   buttons: [{
 *     text: 'Transition Me!',
 *     handler: () => {
 *       // begin the Alert's dimiss transition
 *       let navTransition = alert.dismiss();
 *
 *       // start the page transition when dismissal of
 *       // the Alert is complete
 *       navTransition.then(() => {
 *         this.nav.pop();
 *       });
 *      
 *       // prevent Alert from being dismissed automatically
 *       return false;
 *     }
 *   }]
 * });
 *
 * let alert = this.alertCtrl.create(options);
 *
 * alert.present();
 * ```
 *
 * ## Common Usage Patterns
 *
 * ### Alert with Text Input
 * Prompts offer a way to input data or information.  Often times  Prompts will be used to ask 
 * the user for a password before moving forward in an application’s flow.
 *
 * ```
 * let options = {
 *   title: 'Login',
 *   message: "Enter a name for this new album you're so keen on adding",
 *   inputs: [
 *     {
 *       name: 'title',
 *       placeholder: 'Title'
 *     },
 *   ],
 *   buttons: [
 *     {
 *       text: 'Cancel',
 *       handler: data => {
 *         console.log('Cancel clicked');
 *       }
 *     },
 *     {
 *       text: 'Save',
 *       handler: data => {
 *         console.log('Saved clicked');
 *       }
 *     }
 *   ]
 * }
 * ```
 *
 * ### Confirmation Alerts
 * Confirmation Alerts are used when the user is required to explicitly confirm a choice before 
 * progressing forward in the app. A common example of the Confirmation Alert is checking to make 
 * sure a user wants to delete or remove a contact from their address book.
 *
 * ```
 * let options = {
 *   title: 'Use this lightsaber?',
 *   message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
 *   buttons: [
 *     {
 *       text: 'Disagree',
 *       handler: () => {
 *         console.log('Disagree clicked');
 *       }
 *     },
 *     {
 *       text: 'Agree',
 *       handler: () => {
 *         console.log('Agree clicked');
 *       }
 *     }
 *   ]
 * }
 * ```
 *
 * ### Alert with Radio Buttons
 * Alerts can use the [Radio Button component](/docs/v2/components/#radio) to 
 * offer the user several choices. Only one option can be chosen.
 *
 * ```
 * let alert = this.alertCtrl.create();
 * alert.setTitle('Lightsaber color');
 * 
 * alert.addInput({
 *   type: 'radio',
 *   label: 'Blue',
 *   value: 'blue',
 *   checked: true
 * });
 * 
 * alert.addButton('Cancel');
 * alert.addButton({
 *   text: 'OK',
 *   handler: data => {
 *     this.testRadioResult = data;
 *   }
 * });
 * ```
 *
 * ### Alert with Checkboxes
 * Alerts can use the [Checkbox component](/docs/v2/components/#checkbox) to offer several choices. 
 * Multiple options can be chosen.
 *
 * ```
 * let alert = this.alertCtrl.create();
 * alert.setTitle('Which planets have you visited?');
 *  
 * alert.addInput({
 *   type: 'checkbox',
 *   label: 'Alderaan',
 *   value: 'value1',
 *   checked: true
 * });
 *  
 * alert.addInput({
 *   type: 'checkbox',
 *   label: 'Bespin',
 *   value: 'value2'
 * });
 *  
 * alert.addButton('Cancel');
 * alert.addButton({
 *   text: 'Okay',
 *   handler: data => {
 *     console.log('Checkbox data:', data);
 *   }
 * });
 * ```
 * @demo /docs/v2/demos/src/alert/basic
 * @additionalDemo alert-with-text-input: /docs/v2/demos/src/alert/prompt/
 * @additionalDemo alert-with-checkboxes: /docs/v2/demos/src/alert/checkbox/
 * @additionalDemo alert-with-radio-buttons: /docs/v2/demos/src/alert/radio/
 * @additionalDemo confirmation-alerts: /docs/v2/demos/src/alert/confirm/
 * @see {@link ../AlertController Alert Controller API Docs}
 *
 */
export class Alert extends ViewController {
  private _app: App;

  constructor(app: App, opts: AlertOptions = {}) {
    opts.inputs = opts.inputs || [];
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(AlertCmp, opts, null);
    this._app = app;
    this.isOverlay = true;
  }

  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * Sets the title of the Alert
   * @param {string} title Alert title
   */
  setTitle(title: string) {
    this.data.title = title;
  }

  /**
   * Sets the subtitle of the Alert
   * @param {string} subTitle Alert subtitle
   */
  setSubTitle(subTitle: string) {
    this.data.subTitle = subTitle;
  }

  /**
   * Sets the body text of the Alert
   * @param {string} message  Alert message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   * Adds a new input to the Alert
   * @param {object} input Alert input
   */
  addInput(input: AlertInputOptions) {
    this.data.inputs.push(input);
  }

  /**
   * Adds a new button to the Alert
   * @param {any} button Alert button
   */
  addButton(button: any) {
    this.data.buttons.push(button);
  }

  /**
   * Adds one or more new CSS classes to the Alert
   * @param {string} cssClass Set the CSS class names on the alert's outer wrapper.
   */
  setCssClass(cssClass: string) {
    this.data.cssClass = cssClass;
  }

  /**
   * Shows the Alert instance to the user.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
    return this._app.present(this, navOptions);
  }

}


/**
 * @name AlertController
 * @description
 * AlertController is used to create instances of the Alert class for displaying 
 * the Alert component.
 *
 * For complete information on creating and using the Alert component, see the 
 * [Alert API docs](../Alert)
 *
 * @see {@link ../Alert Alert API Docs}
 */
@Injectable()
export class AlertController {

  constructor(private _app: App) {}
  
  /**
   * Creates an instance of [Alert](../Alert).
   * @param {Object} opts Options object that sets the appearance and behavior of the Alert. 
   *                      See [Alert options](../Alert#alert-options) in the 
   *                      Alert API doc.
   */
  create(opts: AlertOptions = {}): Alert {
    return new Alert(this._app, opts);
  }

}
