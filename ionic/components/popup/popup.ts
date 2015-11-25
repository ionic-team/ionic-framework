import {FORM_DIRECTIVES, NgControl, NgControlGroup,
  Component, ElementRef, Injectable, NgClass, NgIf, NgFor, Renderer} from 'angular2/angular2';

import {OverlayController} from '../overlay/overlay-controller';
import {Config} from '../../config/config';
import {Animation} from '../../animations/animation';
import {NavParams} from '../nav/nav-controller';
import {Button} from '../button/button';
import {extend} from '../../util/util';


/**
 * The Ionic Popup service allows the creation of popup windows that require the user to respond in order to continue.
 *
 * The popup service has support for more flexible versions of the built in `alert()`, `prompt()`, and `confirm()` functions that users are used to, in addition to allowing popups with completely custom content and look.
 *
 * @usage
 * ```ts
 * class myApp {
 *
 *   constructor(popup: Popup) {
 *     this.popup = popup;
 *   }
 *
 *   doAlert() {
 *     this.popup.alert({
 *       title: "New Friend!",
 *       template: "Your friend, Obi wan Kenobi, just accepted your friend request!",
 *       cssClass: 'my-alert'
 *     }).then(() => {
 *       console.log('Alert closed');
 *     });
 *   }
 *
 *   doPrompt() {
 *     this.popup.prompt({
 *       title: "New Album",
 *       template: "Enter a name for this new album you're so keen on adding",
 *       inputPlaceholder: "Title",
 *       okText: "Save",
 *       okType: "secondary"
 *     }).then((name) => {
 *       console.log('Name entered:', name);
 *     }, () => {
 *       console.error('Prompt closed');
 *     });
 *   }
 *
 *   doConfirm() {
 *     this.popup.confirm({
 *       title: "Use this lightsaber?",
 *       subTitle: "You can't exchange lightsabers",
 *       template: "Do you agree to use this lightsaber to do good across the intergalactic galaxy?",
 *       cancelText: "Disagree",
 *       okText: "Agree"
 *     }).then((result, ev) => {
 *       console.log('Confirmed!', result);
 *     }, () => {
 *       console.error('Not confirmed!');
 *     });
 *   }
 * }
 * ```
 */
@Injectable()
export class Popup {

  constructor(ctrl: OverlayController, config: Config) {
    this.ctrl = ctrl;
    this.config = config;
  }

  /**
   * TODO
   * @param {TODO} opts  TODO
   * @returns {object} A promise
   */
  open(opts) {
    return new Promise((resolve, reject)=> {
      opts.promiseResolve = resolve;
      opts.promiseReject = reject;

      opts = extend({
        pageType: OVERLAY_TYPE,
        enterAnimation: this.config.get('popupEnter'),
        leaveAnimation: this.config.get('popupLeave')
      }, opts);

      return this.ctrl.open(PopupCmp, opts, opts);
    });
  }

  /**
   * Show a simple alert popup with a message and one button
   * that the user can tap to close the popup.
   *
   * @param {object} opts The options for showing the alert, of the form:
   *
   * ```
   * {
   *   title: '', // String. The title of the popup.
   *   cssClass: '', // String (optional). The custom CSS class name.
   *   subTitle: '', // String (optional). The sub-title of the popup.
   *   template: '', // String (optional). The html template to place in the popup body.
   *   templateUrl: '', // String (optional). The URL of an html template to place in the popup body.
   *   okText: '', // String (default: 'OK'). The text of the OK button.
   *   okType: '', // String (default: ''). The type of the OK button.
   * }
   * ```
   *
   * @returns {object} A promise which is resolved when the popup is closed.
   */
  alert(opts={}) {
    if (typeof opts === 'string') {
      opts = {
        title: opts
      };
    }
    let button = {
      text: opts.okText || 'OK',
      type: opts.okType || '',
      onTap: (event, popupRef) => {
        // Allow it to close
        //resolve();
      }
    };
    opts = extend({
      showPrompt: false,
      cancel: () => {
        //reject();
      },
      buttons: [
        button
      ]
    }, opts);
    return this.open(opts);
  }

  /**
   * Show a simple confirm popup with a message, Cancel and OK button.
   *
   * Resolves the promise with true if the user presses the OK button, and false if the user presses the Cancel button.
   *
   * @param {object} opts The options for showing the confirm, of the form:
   *
   * ```
   * {
   *   title: '', // String. The title of the popup.
   *   cssClass: '', // String (optional). The custom CSS class name.
   *   subTitle: '', // String (optional). The sub-title of the popup.
   *   template: '', // String (optional). The html template to place in the popup body.
   *   templateUrl: '', // String (optional). The URL of an html template to place in the popup body.
   *   cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
   *   cancelType: '', // String (default: ''). The type of the Cancel button.
   *   okText: '', // String (default: 'OK'). The text of the OK button.
   *   okType: '', // String (default: ''). The type of the OK button.
   * }
   * ```
   *
   * @returns {object} A promise which is resolved when the popup is closed.
   */
  confirm(opts={}) {
    if (typeof opts === 'string') {
      opts = {
        title: opts
      }
    }
    let okButton = {
      text: opts.okText || 'OK',
      type: opts.okType || '',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }
    let cancelButton = {
      text: opts.cancelText || 'Cancel',
      type: opts.cancelType || '',
      isCancel: true,
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }
    opts = extend({
      showPrompt: false,
      cancel: () => {
      },
      buttons: [
        cancelButton, okButton
      ]
    }, opts);
    return this.open(opts);
  }

  /**
   * Show a simple prompt popup with a message, input, Cancel and OK button.
   *
   * Resolves the promise with the value of the input if the user presses OK, and with undefined if the user presses Cancel.
   *
   * @param {object} opts The options for showing the prompt, of the form:
   *
   * ```
   * {
   *   title: '', // String. The title of the popup.
   *   cssClass: '', // String (optional). The custom CSS class name.
   *   subTitle: '', // String (optional). The sub-title of the popup.
   *   template: '', // String (optional). The html template to place in the popup body.
   *   templateUrl: '', // String (optional). The URL of an html template to place in the popup body.
   *   inputType: // String (default: 'text'). The type of input to use.
   *   inputPlaceholder: // String (default: ''). A placeholder to use for the input.
   *   cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
   *   cancelType: '', // String (default: ''). The type of the Cancel button.
   *   okText: '', // String (default: 'OK'). The text of the OK button.
   *   okType: '', // String (default: ''). The type of the OK button.
   * }
   * ```
   *
   * @returns {object} A promise which is resolved when the popup is closed.
   */
  prompt(opts={}) {
    if (typeof opts === 'string') {
      opts = {
        title: opts
      };
    }
    let okButton = {
      text: opts.okText || 'OK',
      type: opts.okType || '',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }

    let cancelButton = {
      text: opts.cancelText || 'Cancel',
      type: opts.cancelType || '',
      isCancel: true,
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }

    opts = extend({
      showPrompt: true,
      promptPlaceholder: '',
      cancel: () => {
      },
      buttons: [
        cancelButton, okButton
      ]
    }, opts);
    return this.open(opts);
  }

  /**
   * TODO
   * @param {TODO} handle  TODO
   * @returns {TODO} TODO
   */
  get(handle) {
    if (handle) {
      return this.ctrl.getByHandle(handle);
    }
    return this.ctrl.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'popup';


// TODO add button type to button: [type]="button.type"
@Component({
  selector: 'ion-popup',
  template:
    '<backdrop (click)="cancel($event)" tappable disable-activated></backdrop>' +
    '<popup-wrapper>' +
      '<div class="popup-head">' +
        '<h2 class="popup-title" [inner-html]="d.title" *ng-if="d.title"></h2>' +
        '<h3 class="popup-sub-title" [inner-html]="d.subTitle" *ng-if="d.subTitle"></h3>' +
      '</div>' +
      '<div class="popup-body">' +
        '<div [inner-html]="d.template" *ng-if="d.template"></div>' +
        '<input type="{{d.inputType || \'text\'}}" placeholder="{{d.inputPlaceholder}}" *ng-if="d.showPrompt" class="prompt-input">' +
      '</div>' +
      '<div class="popup-buttons" *ng-if="d.buttons.length">' +
        '<button *ng-for="#btn of d.buttons" (click)="buttonTapped(btn, $event)" [inner-html]="btn.text"></button>' +
      '</div>' +
    '</popup-wrapper>',
  host: {
    'role': 'dialog'
  },
  directives: [FORM_DIRECTIVES, NgClass, NgIf, NgFor, Button]
})
class PopupCmp {

  constructor(elementRef: ElementRef, params: NavParams, renderer: Renderer) {
    this.elementRef = elementRef;
    this.d = params.data;

    if (this.d.cssClass) {
      renderer.setElementClass(elementRef, this.d.cssClass, true);
    }
  }

  onInit() {
    setTimeout(() => {
      // TODO: make more better, no DOM BS
      this.promptInput = this.elementRef.nativeElement.querySelector('input');
      if (this.promptInput) {
        this.promptInput.value = '';
      }
    });
  }

  buttonTapped(button, ev) {
    let promptValue = this.promptInput && this.promptInput.value;

    let retVal = button.onTap && button.onTap(ev, this, {
      promptValue: promptValue
    });

    // If the event.preventDefault() wasn't called, close
    if (!ev.defaultPrevented) {
      // If this is a cancel button, reject the promise
      if (button.isCancel) {
        this.d.promiseReject();

      } else {
        // Resolve with the prompt value
        this.d.promiseResolve(promptValue);
      }

      return this.close();
    }

  }

  cancel(ev) {
    this.d.cancel && this.d.cancel(event);

    if (!ev.defaultPrevented) {
      this.d.promiseReject();
      return this.close();
    }
  }
}


/**
 * Animations for popups
 */
class PopupPopIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('popup-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.3');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('popup-pop-in', PopupPopIn);


class PopupPopOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('popup-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.3', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('popup-pop-out', PopupPopOut);


class PopupMdPopIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('popup-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('popup-md-pop-in', PopupMdPopIn);


class PopupMdPopOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('popup-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('popup-md-pop-out', PopupMdPopOut);
