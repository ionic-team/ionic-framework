import {Component, ElementRef, Renderer, HostListener, ViewEncapsulation} from '@angular/core';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {isPresent} from '../../util/util';
import {Key} from '../../util/key';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';


/**
 * @name Alert
 * @description
 * An Alert is a dialog that presents users with information or collects
 * information from the user using inputs. An alert appears on top
 * of the app's content, and must be manually dismissed by the user before
 * they can resume interaction with the app. It can also optionally have a
 * `title`, `subTitle` and `message`.
 *
 * You can pass all of the alert's options in the first argument of
 * the create method: `Alert.create(opts)`. Otherwise the alert's instance
 * has methods to add options, such as `setTitle()` or `addButton()`.
 *
 *
 * ### Alert Buttons
 *
 * In the array of `buttons`, each button includes properties for its `text`,
 * and optionally a `handler`. If a handler returns `false` then the alert
 * will not automatically be dismissed when the button is clicked. All
 * buttons will show  up in the order they have been added to the `buttons`
 * array, from left to right. Note: The right most button (the last one in
 * the array) is the main button.
 *
 * Optionally, a `role` property can be added to a button, such as `cancel`.
 * If a `cancel` role is on one of the buttons, then if the alert is
 * dismissed by tapping the backdrop, then it will fire the handler from
 * the button with a cancel role.
 *
 *
 * ### Alert Inputs
 *
 * Alerts can also include several different inputs whose data can be passed
 * back to the app. Inputs can be used as a simple way to prompt users for
 * information. Radios, checkboxes and text inputs are all accepted, but they
 * cannot be mixed. For example, an alert could have all radio button inputs,
 * or all checkbox inputs, but the same alert cannot mix radio and checkbox
 * inputs. Do note however, different types of "text"" inputs can be mixed,
 * such as `url`, `email`, `text`, etc. If you require a complex form UI
 * which doesn't fit within the guidelines of an alert then we recommend
 * building the form within a modal instead.
 *
 *
 * @usage
 * ```ts
 * constructor(nav: NavController) {
 *   this.nav = nav;
 * }
 *
 * presentAlert() {
 *   let alert = Alert.create({
 *     title: 'Low battery',
 *     subTitle: '10% of battery remaining',
 *     buttons: ['Dismiss']
 *   });
 *   this.nav.present(alert);
 * }
 *
 * presentConfirm() {
 *   let alert = Alert.create({
 *     title: 'Confirm purchase',
 *     message: 'Do you want to buy this book?',
 *     buttons: [
 *       {
 *         text: 'Cancel',
 *         role: 'cancel',
 *         handler: () => {
 *           console.log('Cancel clicked');
 *         }
 *       },
 *       {
 *         text: 'Buy',
 *         handler: () => {
 *           console.log('Buy clicked');
 *         }
 *       }
 *     ]
 *   });
 *   this.nav.present(alert);
 * }
 *
 * presentPrompt() {
 *   let alert = Alert.create({
 *     title: 'Login',
 *     inputs: [
 *       {
 *         name: 'username',
 *         placeholder: 'Username'
 *       },
 *       {
 *         name: 'password',
 *         placeholder: 'Password',
 *         type: 'password'
 *       }
 *     ],
 *     buttons: [
 *       {
 *         text: 'Cancel',
 *         role: 'cancel',
 *         handler: data => {
 *           console.log('Cancel clicked');
 *         }
 *       },
 *       {
 *         text: 'Login',
 *         handler: data => {
 *           if (User.isValid(data.username, data.password)) {
 *             // logged in!
 *           } else {
 *             // invalid login
 *             return false;
 *           }
 *         }
 *       }
 *     ]
 *   });
 *   this.nav.present(alert);
 * }
 * ```
 *
 *
 * ### Dismissing And Async Navigation
 *
 * After an alert has been dismissed, the app may need to also transition
 * to another page depending on the handler's logic. However, because multiple
 * transitions were fired at roughly the same time, it's difficult for the
 * nav controller to cleanly animate multiple transitions that may
 * have been kicked off asynchronously. This is further described in the
 * [`Nav Transition Promises`](../../nav/NavController) section. For alerts,
 * this means it's best to wait for the alert to finish its transition
 * out before starting a new transition on the same nav controller.
 *
 * In the example below, after the alert button has been clicked, its handler
 * waits on async operation to complete, *then* it uses `pop` to navigate
 * back a page in the same stack. The potential problem is that the async operation
 * may have been completed before the alert has even finished its transition
 * out. In this case, it's best to ensure the alert has finished its transition
 * out first, *then* start the next transition.
 *
 * ```ts
 * let alert = Alert.create({
 *   title: 'Hello',
 *   buttons: [{
 *     text: 'Ok',
 *     handler: () => {
 *       // user has clicked the alert button
 *       // begin the alert's dismiss transition
 *       let navTransition = alert.dismiss();
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
 * this.nav.present(alert);
 * ```
 *
 * It's important to note that the handler returns `false`. A feature of
 * button handlers is that they automatically dismiss the alert when their button
 * was clicked, however, we'll need more control regarding the transition. Because
 * the handler returns `false`, then the alert does not automatically dismiss
 * itself. Instead, you now have complete control of when the alert has finished
 * transitioning, and the ability to wait for the alert to finish transitioning
 * out before starting a new transition.
 *
 *
 * @demo /docs/v2/demos/alert/
 */
export class Alert extends ViewController {

  constructor(opts: AlertOptions = {}) {
    opts.inputs = opts.inputs || [];
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(AlertCmp, opts);
    this.viewType = 'alert';
    this.isOverlay = true;

    // by default, alerts should not fire lifecycle events of other views
    // for example, when an alert enters, the current active view should
    // not fire its lifecycle events because it's not conceptually leaving
    this.fireOtherLifecycles = false;
  }

  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} title Alert title
   */
  setTitle(title: string) {
    this.data.title = title;
  }

  /**
   * @param {string} subTitle Alert subtitle
   */
  setSubTitle(subTitle: string) {
    this.data.subTitle = subTitle;
  }

  /**
   * @private
   */
  private setBody(message: string) {
    // deprecated warning
    console.warn('Alert setBody() has been renamed to setMessage()');
    this.setMessage(message);
  }

  /**
   * @param {string} message  Alert message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   * @param {object} input Alert input
   */
  addInput(input: AlertInputOptions) {
    this.data.inputs.push(input);
  }

  /**
   * @param {any} button Alert button
   */
  addButton(button: any) {
    this.data.buttons.push(button);
  }

  /**
   * @param {string} cssClass CSS class name to add to the alert's outer wrapper
   */
  setCssClass(cssClass: string) {
    this.data.cssClass = cssClass;
  }

  /**
   *
   *  Alert options
   *
   *  | Property              | Type      | Description                                                               |
   *  |-----------------------|-----------|---------------------------------------------------------------------------|
   *  | title                 | `string`  | The string for the alert (optional)                                       |
   *  | subTitle              | `string`  | The subtitle for the alert (optional)                                     |
   *  | message               | `string`  | The message for the alert (optional)                                      |
   *  | cssClass              | `string`  | Any additional class for the alert (optional)                             |
   *  | inputs                | `array`   | An array of inputs for the alert. See input options. (optional)           |
   *  | buttons               | `array`   | An array of buttons for the alert. See buttons options. (optional)        |
   *  | enableBackdropDismiss | `boolean` | Whether the alert should be dismissed by tapping the backdrop (optional)  |
   *
   *
   *  Input options
   *
   *  | Property    | Type      | Description                                                     |
   *  |-------------|-----------|-----------------------------------------------------------------|
   *  | type        | `string`  | The type the input should be, text, tel, number, etc (optional) |
   *  | name        | `string`  | The name for the input (optional)                               |
   *  | placeholder | `string`  | The input's placeholder (optional, for textual/numeric inputs)  |
   *  | value       | `string`  | The input's value (optional)                                    |
   *  | label       | `string`  | The input's label (optional, only for radio/checkbox inputs)    |
   *  | checked     | `boolean` | Whether or not the input is checked or not (optional)           |
   *  | id          | `string`  | The input's id (optional)                                       |
   *
   *  Button options
   *
   *  | Property | Type     | Description                                                    |
   *  |----------|----------|----------------------------------------------------------------|
   *  | text     | `string` | The buttons displayed text                                     |
   *  | handler  | `any`    | Expression that should be evaluated when the button is pressed |
   *  | cssClass | `string` | An additional CSS class for the button                         |
   *  | role     | `string` | The buttons role, null or `cancel`                             |
   *
   * @param {object} opts Alert. See the table above
   */
  static create(opts: AlertOptions = {}) {
    return new Alert(opts);
  }

}

/**
 * @private
 */
@Component({
  selector: 'ion-alert',
  template:
    '<ion-backdrop (click)="bdClick()"></ion-backdrop>' +
    '<div class="alert-wrapper">' +
      '<div class="alert-head">' +
        '<h2 id="{{hdrId}}" class="alert-title" *ngIf="d.title" [innerHTML]="d.title"></h2>' +
        '<h3 id="{{subHdrId}}" class="alert-sub-title" *ngIf="d.subTitle" [innerHTML]="d.subTitle"></h3>' +
      '</div>' +
      '<div id="{{msgId}}" class="alert-message" [innerHTML]="d.message"></div>' +
      '<div *ngIf="d.inputs.length" [ngSwitch]="inputType">' +

        '<template ngSwitchWhen="radio">' +
          '<div class="alert-radio-group" role="radiogroup" [attr.aria-labelledby]="hdrId" [attr.aria-activedescendant]="activeId">' +
            '<button category="alert-radio-button" *ngFor="let i of d.inputs" (click)="rbClick(i)" [attr.aria-checked]="i.checked" [attr.id]="i.id" class="alert-tappable alert-radio" role="radio">' +
              '<div class="alert-radio-icon"><div class="alert-radio-inner"></div></div>' +
              '<div class="alert-radio-label">' +
                '{{i.label}}' +
              '</div>' +
            '</button>' +
          '</div>' +
        '</template>' +

        '<template ngSwitchWhen="checkbox">' +
          '<div class="alert-checkbox-group">' +
            '<button category="alert-checkbox-button" *ngFor="let i of d.inputs" (click)="cbClick(i)" [attr.aria-checked]="i.checked" class="alert-tappable alert-checkbox" role="checkbox">' +
              '<div class="alert-checkbox-icon"><div class="alert-checkbox-inner"></div></div>' +
              '<div class="alert-checkbox-label">' +
                '{{i.label}}' +
              '</div>' +
            '</button>' +
          '</div>' +
        '</template>' +

        '<template ngSwitchDefault>' +
          '<div class="alert-input-group">' +
            '<div *ngFor="let i of d.inputs" class="alert-input-wrapper">' +
              '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" class="alert-input">' +
            '</div>' +
          '</div>' +
        '</template>' +

      '</div>' +
      '<div class="alert-button-group" [ngClass]="{vertical: d.buttons.length>2}">' +
        '<button category="alert-button" *ngFor="let b of d.buttons" (click)="btnClick(b)" [ngClass]="b.cssClass">' +
          '{{b.text}}' +
        '</button>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId'
  },
  encapsulation: ViewEncapsulation.None,
})
class AlertCmp {
  private activeId: string;
  private descId: string;
  private d: {
    cssClass?: string;
    message?: string;
    subTitle?: string;
    buttons?: any[];
    inputs?: any[];
    enableBackdropDismiss?: boolean;
  };
  private enabled: boolean;
  private hdrId: string;
  private id: number;
  private inputType: string;
  private lastClick: number;
  private msgId: string;
  private subHdrId: string;

  constructor(
    private _viewCtrl: ViewController,
    private _elementRef: ElementRef,
    private _config: Config,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++alertIds);
    this.descId = '';
    this.hdrId = 'alert-hdr-' + this.id;
    this.subHdrId = 'alert-subhdr-' + this.id;
    this.msgId = 'alert-msg-' + this.id;
    this.activeId = '';
    this.lastClick = 0;

    if (this.d.message) {
      this.descId = this.msgId;

    } else if (this.d.subTitle) {
      this.descId = this.subHdrId;
    }

    if (!this.d.message) {
      this.d.message = '';
    }
  }

  ionViewLoaded() {
    // normalize the data
    let data = this.d;

    data.buttons = data.buttons.map(button => {
      if (typeof button === 'string') {
        return { text: button };
      }
      return button;
    });

    data.inputs = data.inputs.map((input, index) => {
      return {
        type: input.type || 'text',
        name: isPresent(input.name) ? input.name : index,
        placeholder: isPresent(input.placeholder) ? input.placeholder : '',
        value: isPresent(input.value) ? input.value : '',
        label: input.label,
        checked: !!input.checked,
        id: 'alert-input-' + this.id + '-' + index
      };
    });


    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    let inputTypes: any[] = [];
    data.inputs.forEach(input => {
      if (inputTypes.indexOf(input.type) < 0) {
        inputTypes.push(input.type);
      }
    });

    if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
      console.warn('Alert cannot mix input types: ' + (inputTypes.join('/')) + '. Please see alert docs for more info.');
    }

    this.inputType = inputTypes.length ? inputTypes[0] : null;

    let checkedInput = this.d.inputs.find(input => input.checked);
    if (checkedInput) {
      this.activeId = checkedInput.id;
    }
  }

  @HostListener('body:keyup', ['$event'])
  private _keyUp(ev: KeyboardEvent) {
    if (this.enabled && this._viewCtrl.isLast()) {
      if (ev.keyCode === Key.ENTER) {
        if (this.lastClick + 1000 < Date.now()) {
          // do not fire this click if there recently was already a click
          // this can happen when the button has focus and used the enter
          // key to click the button. However, both the click handler and
          // this keyup event will fire, so only allow one of them to go.
          console.debug('alert, enter button');
          let button = this.d.buttons[this.d.buttons.length - 1];
          this.btnClick(button);
        }

      } else if (ev.keyCode === Key.ESCAPE) {
        console.debug('alert, escape button');
        this.bdClick();
      }
    }
  }

  ionViewDidEnter() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('input,button');
    if (focusableEle) {
      focusableEle.focus();
    }
    this.enabled = true;
  }

  btnClick(button: any, dismissDelay?: number) {
    if (!this.enabled) {
      return;
    }

    // keep the time of the most recent button click
    this.lastClick = Date.now();

    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      if (button.handler(this.getValues()) === false) {
        // if the return value of the handler is false then do not dismiss
        shouldDismiss = false;
      }
    }

    if (shouldDismiss) {
      setTimeout(() => {
        this.dismiss(button.role);
      }, dismissDelay || this._config.get('pageTransitionDelay'));
    }
  }

  rbClick(checkedInput: any) {
    if (this.enabled) {
      this.d.inputs.forEach(input => {
        input.checked = (checkedInput === input);
      });
      this.activeId = checkedInput.id;
    }
  }

  cbClick(checkedInput: any) {
    if (this.enabled) {
      checkedInput.checked = !checkedInput.checked;
    }
  }

  bdClick() {
    if (this.enabled && this.d.enableBackdropDismiss) {
      let cancelBtn = this.d.buttons.find(b => b.role === 'cancel');
      if (cancelBtn) {
        this.btnClick(cancelBtn, 1);

      } else {
        this.dismiss('backdrop');
      }
    }
  }

  dismiss(role: any): Promise<any> {
    return this._viewCtrl.dismiss(this.getValues(), role);
  }

  getValues() {
    if (this.inputType === 'radio') {
      // this is an alert with radio buttons (single value select)
      // return the one value which is checked, otherwise undefined
      let checkedInput = this.d.inputs.find(i => i.checked);
      return checkedInput ? checkedInput.value : undefined;
    }

    if (this.inputType === 'checkbox') {
      // this is an alert with checkboxes (multiple value select)
      // return an array of all the checked values
      return this.d.inputs.filter(i => i.checked).map(i => i.value);
    }

    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    let values = {};
    this.d.inputs.forEach(i => {
      values[i.name] = i.value;
    });
    return values;
  }
}

export interface AlertOptions {
  title?: string;
  subTitle?: string;
  message?: string;
  cssClass?: string;
  inputs?: Array<AlertInputOptions>;
  buttons?: Array<any>;
  enableBackdropDismiss?: boolean;
}

export interface AlertInputOptions {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  label?: string;
  checked?: boolean;
  id?: string;
}


/**
 * Animations for alerts
 */
class AlertPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.3');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('alert-pop-in', AlertPopIn);


class AlertPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.3', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('alert-pop-out', AlertPopOut);


class AlertMdPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('alert-md-pop-in', AlertMdPopIn);


class AlertMdPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('alert-md-pop-out', AlertMdPopOut);



class AlertWpPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('cubic-bezier(0,0 0.05,1)')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('alert-wp-pop-in', AlertWpPopIn);


class AlertWpPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-out')
      .duration(150)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('alert-wp-pop-out', AlertWpPopOut);

let alertIds = -1;
