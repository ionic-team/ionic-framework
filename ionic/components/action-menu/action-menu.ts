/**
* @ngdoc service
* @name ActionMenu
* @module ionic
* @description
* The ActionMenu is a modal menu with options to select based on an action.
*/

import {View, Injectable, NgFor, NgIf} from 'angular2/angular2';

import {TapClick} from '../button/button';
import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


@View({
  template: `
    <div class="action-menu-backdrop" (click)="_cancel()" tappable></div>
    <div class="action-menu-wrapper">
      <div class="action-menu-container">
        <div class="action-menu-group action-menu-options">
          <div class="action-menu-title" *ng-if="titleText">{{titleText}}</div>
          <button (click)="_buttonClicked(index)" *ng-for="#b of buttons; #index = index" class="action-menu-option">{{b.text}}</button>
          <button *ng-if="destructiveText" (click)="_destructive()" class="destructive action-menu-destructive">{{destructiveText}}</button>
        </div>
        <div class="action-menu-group action-menu-cancel" *ng-if="cancelText">
          <button (click)="_cancel()">{{cancelText}}</button>
        </div>
      </div>
    </div>`,
  directives: [NgFor, NgIf, TapClick]
})
class ActionMenuDirective {

  _cancel() {
    this.cancel && this.cancel();
    return this.overlayRef.close();
  }

  _destructive() {
    let shouldClose = this.destructiveButtonClicked();
    if (shouldClose === true) {
      return this.overlayRef.close();
    }
  }

  _buttonClicked(index) {
    let shouldClose = this.buttonClicked(index);
    if (shouldClose === true) {
      return this.overlayRef.close();
    }
  }
}


@Injectable()
export class ActionMenu extends Overlay {
  /**
   * Create and open a new Action Menu. This is the
   * public API, and most often you will only use ActionMenu.open()
   *
   * @return Promise that resolves when the action menu is open.
   */
  open(opts={}) {
    let defaults = {
      enterAnimation: 'action-menu-slide-in',
      leaveAnimation: 'action-menu-slide-out'
    };

    return this.create(OVERLAY_TYPE, ActionMenuDirective, util.extend(defaults, opts), opts);
  }

  get() {
    return Modal.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'action-menu';


/**
 * Animations for action sheet
 */
class ActionMenuAnimation extends Animation {
  constructor(element) {
    super(element);
    this.easing('cubic-bezier(.36, .66, .04, 1)').duration(400);

    this.backdrop = new Animation(element.querySelector('.action-menu-backdrop'));
    this.wrapper = new Animation(element.querySelector('.action-menu-wrapper'));

    this.add(this.backdrop, this.wrapper);
  }
}

class ActionMenuSlideIn extends ActionMenuAnimation {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', 0, 0.4);
    this.wrapper.fromTo('translateY', '100%', '0%');
  }
}
Animation.register('action-menu-slide-in', ActionMenuSlideIn);

class ActionMenuSlideOut extends ActionMenuAnimation {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', 0.4, 0);
    this.wrapper.fromTo('translateY', '0%', '100%');
  }
}
Animation.register('action-menu-slide-out', ActionMenuSlideOut);
