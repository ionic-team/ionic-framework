import {FORM_DIRECTIVES, NgControl, NgControlGroup,
  Component, View, Injectable, NgClass, NgIf, NgFor} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


/**
 * @name ionPopup
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
     * @param {TODO} [opts={}]  TODO
     * @returns {TODO} TODO
     */
    popup(context, opts={}) {
    return new Promise((resolve, reject)=> {
      let defaults = {
        enterAnimation: 'popup-pop-in',
        leaveAnimation: 'popup-pop-out',
      };

      context.promiseResolve = resolve;
      context.promiseReject = reject;

      return this.create(OVERLAY_TYPE, StandardPopup, util.extend(defaults, opts), context);
    });
  }

  /**
   * TODO
   * @param {TODO} context  TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {TODO} TODO
   */
  alert(context={}, opts={}) {
    if (typeof context === 'string') {
      context = {
        title: context
      };
    }
    let button = {
      text: 'OK',
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

    return this.popup(context, opts);
  }

  /**
   * TODO
   * @param {TODO} context  TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {TODO} TODO
   */
  confirm(context={}, opts={}) {
    if (typeof context === 'string') {
      context = {
        title: context
      }
    }
    let okButton = {
      text: 'OK',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }
    let cancelButton = {
      text: 'Cancel',
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
    return this.popup(context, opts);
  }

  /**
   * TODO
   * @param {TODO} [context={}]  TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {TODO} TODO
   */
  prompt(context={}, opts={}) {
    if (typeof context === 'string') {
      context = {
        title: context
      };
    }

    let okButton = {
      text: 'Ok',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }

    let cancelButton = {
      text: 'Cancel',
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

    return this.popup(context, opts);
  }

  /**
   * TODO
   * @param {TODO} context  TODO
   * @param {TODO} [opts={}]  TODO
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
  '<popup-wrapper>' +
    '<div class="popup-head">' +
      '<h3 class="popup-title" [inner-html]="title"></h3>' +
      '<h5 class="popup-sub-title" [inner-html]="subTitle" *ng-if="subTitle"></h5>' +
    '</div>' +
    '<div class="popup-body">' +
      '<input type="text" *ng-if="showPrompt" placeholder="{{promptPlaceholder}}">' +
    '</div>' +
    '<div class="popup-buttons" *ng-if="buttons.length">' +
      '<button *ng-for="#button of buttons" (click)="buttonTapped(button, $event)" [ng-class]="button.type || \'button-default\'" [inner-html]="button.text"></button>' +
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
