import {FORM_DIRECTIVES, NgControl, NgControlGroup,
  Component, View, Injectable, NgClass, NgIf, NgFor} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import {Ion} from '../ion';
import * as util from 'ionic/util';


/**
 * @name Popup
 * @description
 * The Ionic Popup service allows programmatically creating and showing popup windows that require the user to respond in order to continue.
 *
 * The popup system has support for more flexible versions of the built in `alert()`, `prompt()`, and `confirm()` functions that users are used to, in addition to allowing popups with completely custom content and look.
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
 *     this.popup.alert('Alert').then(() => {
 *       console.log('Alert closed');
 *     });
 *   }
 *
 *   doPrompt() {
 *     this.popup.prompt('What is your name?').then((name) => {
 *       console.log('Name entered:', name);
 *     }, () => {
 *       console.error('Prompt closed');
 *     });
 *   }
 *
 *   doConfirm() {
 *     this.popup.confirm('Are you sure?').then((result, ev) => {
 *       console.log('Confirmed!', result);
 *     }, () => {
 *       console.error('Not confirmed!');
 *     });
 *   }
 * }
 * ```
 */
@Injectable()
export class Popup extends Overlay {

    /**
     * TODO
     * @param {TODO} context  TODO
     * @returns {TODO} TODO
     */
    popup(context) {
    return new Promise((resolve, reject)=> {
      let config = this.config;
      let defaults = {
        enterAnimation: config.setting('popupPopIn'),
        leaveAnimation: config.setting('popupPopOut'),
      };

      context.promiseResolve = resolve;
      context.promiseReject = reject;

      return this.create(OVERLAY_TYPE, StandardPopup, defaults, context);
    });
  }

  /**
   * TODO
   * @param {TODO} context  TODO
   * @returns {TODO} TODO
   */
  alert(context={}) {
    if (typeof context === 'string') {
      context = {
        title: context
      };
    }
    let button = {
      text: context.okText || 'OK',
      type: context.okType || 'primary',
      onTap: (event, popupRef) => {
        // Allow it to close
        //resolve();
      }
    };
    context = util.extend({
      cancel: () => {
        //reject();
      },
      buttons: [
        button
      ]
    }, context);

    return this.popup(context);
  }

  /**
   * TODO
   * @param {TODO} context  TODO
   * @returns {TODO} TODO
   */
  confirm(context={}) {
    if (typeof context === 'string') {
      context = {
        title: context
      }
    }
    let okButton = {
      text: context.okText || 'OK',
      type: context.okType || 'primary',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }
    let cancelButton = {
      text: context.cancelText || 'Cancel',
      type: context.cancelType || 'primary',
      isCancel: true,
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }
    context = util.extend({
      cancel: () => {
      },
      buttons: [
        cancelButton, okButton
      ]
    }, context);
    return this.popup(context);
  }

  /**
   * TODO
   * @param {TODO} [context={}]  TODO
   * @returns {TODO} TODO
   */
  prompt(context={}) {
    if (typeof context === 'string') {
      context = {
        title: context
      };
    }
    let okButton = {
      text: context.okText || 'OK',
      type: context.okType || 'primary',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }

    let cancelButton = {
      text: context.cancelText || 'Cancel',
      type: context.cancelType || 'primary',
      isCancel: true,
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }

    context = util.extend({
      showPrompt: true,
      promptPlaceholder: '',
      cancel: () => {
      },
      buttons: [
        cancelButton, okButton
      ]
    }, context);

    return this.popup(context);
  }

  /**
   * TODO
   * @param {TODO} context  TODO
   * @returns {TODO} TODO
   */
  get(handle) {
    if (handle) {
      return this.getByHandle(handle, OVERLAY_TYPE);
    }
    return this.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'popup';


@Component({
  selector: 'ion-popup-default'
})
@View({
  template:
  '<backdrop (click)="_cancel($event)" tappable disable-activated></backdrop>' +
  '<popup-wrapper [ng-class]="cssClass">' +
    '<div class="popup-head">' +
      '<h2 class="popup-title" [inner-html]="title" *ng-if="title"></h2>' +
      '<h3 class="popup-sub-title" [inner-html]="subTitle" *ng-if="subTitle"></h3>' +
    '</div>' +
    '<div class="popup-body">' +
      '<div [inner-html]="template" *ng-if="template"></div>' +
      '<input type="{{inputType || \'text\'}}" placeholder="{{inputPlaceholder}}" *ng-if="showPrompt" class="prompt-input">' +
    '</div>' +
    '<div class="popup-buttons" *ng-if="buttons.length">' +
      '<button *ng-for="#button of buttons" (click)="buttonTapped(button, $event)" [inner-html]="button.text"></button>' +
    '</div>' +
  '</popup-wrapper>',
  directives: [FORM_DIRECTIVES, NgClass, NgIf, NgFor]
})

class StandardPopup {
  constructor(popup: Popup) {
    this.popup = popup;
  }
  onInit() {
    setTimeout(() => {
      this.element = this.overlayRef.getElementRef().nativeElement;
      this.promptInput = this.element.querySelector('input');
      if (this.promptInput) {
        this.promptInput.value = '';
      }
    });
  }
  buttonTapped(button, event) {
    let promptValue = this.promptInput && this.promptInput.value;

    let retVal = button.onTap && button.onTap(event, this, {
      promptValue: promptValue
    });

    // If the event.preventDefault() wasn't called, close
    if (!event.defaultPrevented) {
      // If this is a cancel button, reject the promise
      if (button.isCancel) {
        this.promiseReject();
      } else {
        // Resolve with the prompt value
        this.promiseResolve(promptValue);
      }
      return this.overlayRef.close();
    }

  }
  _cancel(event) {
    this.cancel && this.cancel(event);

    if (!event.defaultPrevented) {
      this.promiseReject();
      return this.overlayRef.close();
    }
  }
}

class PopupAnimation extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-in-out')
      .duration(200);

    this.backdrop = new Animation(element.querySelector('backdrop'));
    this.wrapper = new Animation(element.querySelector('popup-wrapper'));

    this.add(this.backdrop, this.wrapper);
  }
}

/**
 * Animations for modals
 */
class PopupPopIn extends PopupAnimation {
  constructor(element) {
    super(element);
    this.wrapper.fromTo('opacity', '0', '1')
    this.wrapper.fromTo('scale', '1.1', '1');

    this.backdrop.fromTo('opacity', '0', '0.3')
  }
}
Animation.register('popup-pop-in', PopupPopIn);

class PopupPopOut extends PopupAnimation {
  constructor(element) {
    super(element);
    this.wrapper.fromTo('opacity', '1', '0')
    this.wrapper.fromTo('scale', '1', '0.9');

    this.backdrop.fromTo('opacity', '0.3', '0')
  }
}
Animation.register('popup-pop-out', PopupPopOut);

class PopupMdPopIn extends PopupPopIn {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', '0', '0.5')
  }
}
Animation.register('popup-md-pop-in', PopupMdPopIn);

class PopupMdPopOut extends PopupPopOut {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', '0.5', '0')
  }
}
Animation.register('popup-md-pop-out', PopupMdPopOut);
