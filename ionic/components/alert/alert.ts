import {Component, ElementRef, Renderer} from 'angular2/core';
import {NgClass, NgSwitch, NgIf, NgFor} from 'angular2/common';

import {Animation} from '../../animations/animation';
import {Config} from '../../config/config';
import {isDefined} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';


/**
 * @name Alert
 * @description
 * An Alert is a dialog that presents users with either information, or used
 * to receive information from the user using inputs. An alert appears on top
 * of the app's content, and must be manually dismissed by the user before
 * they can resume interaction with the app.
 *
 * An alert is created from an array of `buttons` and optionally an array of
 * `inputs`. Each button includes properties for its `text`, and optionally a
 * `handler`. If a handler returns `false` then the alert will not be dismissed.
 * An alert can also optionally have a `title`, `subTitle` and `message`.
 *
 * All buttons will show up in the order they have been added to the `buttons`
 * array, from left to right. Note: The right most button (the last one in the
 * array) is the main button.
 *
 * Optionally, a `role` property can be added to a button, such as `cancel`.
 * If a `cancel` role is on one of the buttons, then if the alert is dismissed
 * by tapping the backdrop, then it will fire the handler from the button
 * with a cancel role.
 *
 * Alerts can also include inputs whos data can be passed back to the app.
 * Inputs can be used to prompt users for information.
 *
 * Its shorthand is to add all the alert's options from within the
 * `Alert.create(opts)` first argument. Otherwise the alert's instance
 * has methods to add options, such as `setTitle()` or `addButton()`.
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
 * @demo /docs/v2/demos/alert/ 
 */
export class Alert extends ViewController {

  constructor(opts: {
    title?: string,
    subTitle?: string,
    message?: string,
    cssClass?: string,
    inputs?: Array<{
      type?: string,
      name?: string,
      placeholder?: string,
      value?: string,
      label?: string,
      checked?: boolean,
      id?: string
    }>,
    buttons?: Array<any>
  } = {}) {
    opts.inputs = opts.inputs || [];
    opts.buttons = opts.buttons || [];

    super(AlertCmp, opts);
    this.viewType = 'alert';
  }

  /**
  * @private
  */
  getTransitionName(direction) {
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
  addInput(input: {
    type?: string,
    name?: string,
    placeholder?: string,
    value?: string,
    label?: string,
    checked?: boolean,
    id?: string
  }) {
    this.data.inputs.push(input);
  }

  /**
   * @param {object} button Alert button
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
   * @param {Object} opts Alert options
   */
  static create(opts: {
    title?: string,
    subTitle?: string,
    message?: string,
    cssClass?: string,
    inputs?: Array<{
      type?: string,
      name?: string,
      placeholder?: string,
      value?: string,
      label?: string,
      checked?: boolean,
      id?: string
    }>,
    buttons?: Array<any>
  } = {}) {
    return new Alert(opts);
  }

}

/**
* @private
*/
@Component({
  selector: 'ion-alert',
  template:
    '<div (click)="bdClick()" tappable disable-activated class="backdrop" role="presentation"></div>' +
    '<div class="alert-wrapper">' +
      '<div class="alert-head">' +
        '<h2 id="{{hdrId}}" class="alert-title" *ngIf="d.title" [innerHTML]="d.title"></h2>' +
        '<h3 id="{{subHdrId}}" class="alert-sub-title" *ngIf="d.subTitle" [innerHTML]="d.subTitle"></h3>' +
      '</div>' +
      '<div id="{{msgId}}" class="alert-message" *ngIf="d.message" [innerHTML]="d.message"></div>' +
      '<div *ngIf="d.inputs.length" [ngSwitch]="inputType">' +

        '<template ngSwitchWhen="radio">' +
          '<div class="alert-radio-group" role="radiogroup" [attr.aria-labelledby]="hdrId" [attr.aria-activedescendant]="activeId">' +
            '<div *ngFor="#i of d.inputs" (click)="rbClick(i)" [attr.aria-checked]="i.checked" [attr.id]="i.id" class="alert-tappable alert-radio" tappable role="radio">' +
              '<div class="alert-radio-icon"></div>' +
              '<div class="alert-radio-label">' +
                '{{i.label}}' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</template>' +

        '<template ngSwitchWhen="checkbox">' +
          '<div class="alert-checkbox-group">' +
            '<div *ngFor="#i of d.inputs" (click)="cbClick(i)" [attr.aria-checked]="i.checked" class="alert-tappable alert-checkbox" tappable role="checkbox">' +
              '<div class="alert-checkbox-icon"><div class="alert-checkbox-inner"></div></div>' +
              '<div class="alert-checkbox-label">' +
                '{{i.label}}' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</template>' +

        '<template ngSwitchDefault>' +
          '<div class="alert-input-group">' +
            '<div *ngFor="#i of d.inputs" class="alert-input-wrapper">' +
              '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" class="alert-input">' +
            '</div>' +
          '</div>' +
        '</template>' +

      '</div>' +
      '<div class="alert-button-group" [ngClass]="{vertical: d.buttons.length>2}">' +
        '<button *ngFor="#b of d.buttons" (click)="btnClick(b)" [ngClass]="b.cssClass" class="alert-button">' +
          '{{b.text}}' +
        '</button>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId'
  },
  directives: [NgClass, NgSwitch, NgIf, NgFor]
})
class AlertCmp {
  activeId: string;
  descId: string;
  d: any;
  hdrId: string;
  id: number;
  subHdrId: string;
  msgId: string;
  inputType: string;
  keyUp: any;

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

    if (this.d.message) {
      this.descId = this.msgId;

    } else if (this.d.subTitle) {
      this.descId = this.subHdrId;
    }
  }

  onPageLoaded() {
    // normalize the data
    let data = this.d;

    if (data.body) {
      // deprecated warning
      console.warn('Alert `body` property has been renamed to `message`');
      data.message = data.body;
    }

    data.buttons = data.buttons.map(button => {
      if (typeof button === 'string') {
        return { text: button };
      }
      return button;
    });

    data.inputs = data.inputs.map((input, index) => {
      return {
        type: input.type || 'text',
        name: isDefined(input.name) ? input.name : index,
        placeholder: isDefined(input.placeholder) ? input.placeholder : '',
        value: isDefined(input.value) ? input.value : '',
        label: input.label,
        checked: !!input.checked,
        id: 'alert-input-' + this.id + '-' + index
      };
    });

    this.inputType = (data.inputs.length ? data.inputs[0].type : null);

    let checkedInput = this.d.inputs.find(input => input.checked);
    if (checkedInput) {
      this.activeId = checkedInput.id;
    }

    let self = this;
    self.keyUp = function(ev) {
      if (ev.keyCode === 13) {
        // enter
        console.debug('alert enter');
        let button = self.d.buttons[self.d.buttons.length - 1];
        self.btnClick(button);

      } else if (ev.keyCode === 27) {
        console.debug('alert escape');
        self.bdClick();
      }
    };

    document.addEventListener('keyup', this.keyUp);
  }

  onPageDidEnter() {
    let activeElement: any = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }

    if (this.d.inputs.length) {
      let firstInput = this._elementRef.nativeElement.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }

  btnClick(button, dismissDelay?) {
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

  rbClick(checkedInput) {
    this.d.inputs.forEach(input => {
      input.checked = (checkedInput === input);
    });
    this.activeId = checkedInput.id;
  }

  cbClick(checkedInput) {
    checkedInput.checked = !checkedInput.checked;
  }

  bdClick() {
    let cancelBtn = this.d.buttons.find(b => b.role === 'cancel');
    if (cancelBtn) {
      this.btnClick(cancelBtn, 1);

    } else {
      this.dismiss('backdrop');
    }
  }

  dismiss(role): Promise<any> {
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

  onPageDidLeave() {
    document.removeEventListener('keyup', this.keyUp);
  }
}


/**
 * Animations for alerts
 */
class AlertPopIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.3');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-pop-in', AlertPopIn);


class AlertPopOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.3', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-pop-out', AlertPopOut);


class AlertMdPopIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-md-pop-in', AlertMdPopIn);


class AlertMdPopOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-md-pop-out', AlertMdPopOut);

let alertIds = -1;
