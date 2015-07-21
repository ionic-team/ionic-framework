import {Component, View, Injectable, CSSClass, NgIf, NgFor, onInit} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


@Injectable()
export class Popup extends Overlay {

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

  alert(context={}, opts={}) {
    if(typeof context === 'string') {
      let button = {
        text: 'OK',
        onTap: (event, popupRef) => {
          // Allow it to close
          //resolve();
        }
      };
      context = {
        cancel: () => {
          //reject();
        },
        title: context,
        buttons: [
          button
        ]
      };
    }

    return this.popup(context, opts);
  }

  confirm(context={}, opts={}) {
    return new Promise((resolve, reject)=> {
      if(typeof context === 'string') {
        let okButton = {
          text: 'OK',
          onTap: (event, popupRef) => {
            // Allow it to close
            resolve(true);
          }
        }
        let cancelButton = {
          text: 'Cancel',
          onTap: (event, popupRef) => {
            // Allow it to close
            reject();
          }
        }
        context = {
          cancel: () => {
            reject();
          },
          title: context,
          buttons: [
            cancelButton, okButton
          ]
        }
      }
      this.popup(context, opts);
    });
  }

  prompt(context={}, opts={}) {
    return new Promise((resolve, reject)=> {
      if(typeof context === 'string') {
        let okButton = {
          text: 'Ok',
          onTap: (event, popupRef) => {
            // Allow it to close
          }
        }
        let cancelButton = {
          text: 'Cancel',
          onTap: (event, popupRef) => {
            // Allow it to close
            reject();
          }
        }
        context = {
          cancel: () => {
            reject();
          },
          title: context,
          buttons: [
            cancelButton, okButton
          ]
        }
      }
      this.popup(context, opts);
    });

  }

  get(handle) {
    if (handle) {
      return this.getByHandle(handle, OVERLAY_TYPE);
    }
    return this.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'popup';


@Component({
  selector: 'ion-popup-default',
  lifecycle: [onInit]
})
@View({
  template: '<div class="popup-backdrop" (click)="_cancel($event)" tappable></div>' +
  '<div class="popup-wrapper">' +
    '<div class="popup-head">' +
      '<h3 class="popup-title" [inner-html]="title"></h3>' +
      '<h5 class="popup-sub-title" [inner-html]="subTitle" *ng-if="subTitle"></h5>' +
    '</div>' +
    '<div class="popup-body">' +
    '</div>' +
    '<div class="popup-buttons" *ng-if="buttons.length">' +
      '<button *ng-for="#button of buttons" (click)="buttonTapped(button, $event)" class="button" [class]="button.type || \'button-default\'" [inner-html]="button.text"></button>' +
    '</div>' +
  '</div>' +
'</div>',
  directives: [CSSClass, NgIf, NgFor]
})

class StandardPopup {
  constructor(popup: Popup) {
    this.popup = popup;

  }
  onInit() {
    console.log(this.promiseResolve);
  }
  buttonTapped(button, event) {
    let retVal = button.onTap && button.onTap(event, this);

    // If the event.preventDefault() called, don't close
    if(!event.defaultPrevented) {
      return this.overlayRef.close();
    }
  }
  _cancel(event) {
    this.cancel && this.cancel(event);

    if(!event.defaultPrevented) {
      this.promiseReject.resolve();
      return this.overlayRef.close();
    }
  }

  /*
  _buttonClicked(index) {
    let shouldClose = this.buttonClicked(index);
    if (shouldClose === true) {
      return this.overlayRef.close();
    }
  }
  */

}

class PopupAnimation extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-in-out')
      .duration(200);

    this.backdrop = new Animation(element.querySelector('.popup-backdrop'));
    this.wrapper = new Animation(element.querySelector('.popup-wrapper'));

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
