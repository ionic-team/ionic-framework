import {Component, View, Injectable, CSSClass, NgIf, NgFor} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


@Injectable()
export class Popup extends Overlay {

  alert(context={}, opts={}) {
    if(typeof context === 'string') {
      let button = {
        text: 'Ok',
        onTap: (event, popupRef) => {
          // Allow it to close
        }
      }
      context = {
        title: context,
        buttons: [
          button
        ]
      }
    }
    let defaults = {
      enterAnimation: 'popup-pop-in',
      leaveAnimation: 'popup-pop-out',
    };

    return this.create(OVERLAY_TYPE, StandardPopup, util.extend(defaults, opts), context);
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
  selector: 'ion-popup-default'
})
@View({
  template: '<div class="popup-backdrop" (click)="_cancel()" tappable></div>' +
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
  buttonTapped(button, event) {
    button.onTap && button.onTap(event, this);

    // If the event.preventDefault() called, don't close
    if(!event.defaultPrevented) {
      return this.overlayRef.close();
    }
  }
  _cancel() {
    this.cancel && this.cancel();
    return this.overlayRef.close();
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
    this.wrapper.fromTo('scale', '1.2', '1');

    this.backdrop.fromTo('opacity', '0', '0.3')
  }
}
Animation.register('popup-pop-in', PopupPopIn);


class PopupPopOut extends PopupAnimation {
  constructor(element) {
    super(element);
    this.wrapper.fromTo('opacity', '1', '0')
    this.wrapper.fromTo('scale', '1', '0.8');

    this.backdrop.fromTo('opacity', '0.3', '0')
  }
}
Animation.register('popup-pop-out', PopupPopOut);
