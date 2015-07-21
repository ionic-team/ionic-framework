import {Component, View, Injectable, CSSClass, NgIf, NgFor} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


@Injectable()
export class Popup extends Overlay {

  alert(context={}) {
    if(typeof context === 'string') {
      context = {
        text: context,
        buttons: [
          { text: 'Ok' }
        ]
      }
    }
    let defaults = {
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out',
    };

    return this.create(OVERLAY_TYPE, AlertType, util.extend(defaults, opts), context);
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
  selector: 'ion-popup-alert'
})
@View({
  template: '<div class="popup">' +
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
class AlertType {
  constructor() {
    console.log('Alert type');
  }
}

/**
 * Animations for modals
 */
class ModalSlideIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('cubic-bezier(.36,.66,.04,1)')
      .duration(400)
      .fromTo('translateY', '100%', '0%');
  }
}
Animation.register('modal-slide-in', ModalSlideIn);


class ModalSlideOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-out')
      .duration(250)
      .fromTo('translateY', '0%', '100%');
  }
}
Animation.register('modal-slide-out', ModalSlideOut);
