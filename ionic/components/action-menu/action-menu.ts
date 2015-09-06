/**
* @ngdoc service
* @name ActionMenu
* @module ionic
* @description
* The ActionMenu is a modal menu with options to select based on an action.
*/

import {View, Injectable, NgFor, NgIf} from 'angular2/angular2';

import {TapClick} from '../button/button';
import {Icon} from '../icon/icon';
import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';


@View({
  template:
    '<backdrop (click)="_cancel()" tappable></backdrop>' +
    '<action-menu-wrapper>' +
      '<div class="action-menu-container">' +
        '<div class="action-menu-group action-menu-options">' +
          '<div class="action-menu-title" *ng-if="titleText">{{titleText}}</div>' +
          '<button (^click)="_buttonClicked(index)" *ng-for="#b of buttons; #index = index" class="action-menu-option">' +
            '<icon [name]="b.icon" *ng-if="b.icon"></icon> ' +
            '{{b.text}}' +
          '</button>' +
          '<button *ng-if="destructiveText" (click)="_destructive()" class="destructive action-menu-destructive">' +
            '<icon [name]="destructiveIcon" *ng-if="destructiveIcon"></icon> ' +
            '{{destructiveText}}</button>' +
        '</div>' +
        '<div class="action-menu-group action-menu-cancel" *ng-if="cancelText">' +
          '<button (click)="_cancel()">' +
            '<icon [name]="cancelIcon"></icon> ' +
            '{{cancelText}}</button>' +
        '</div>' +
      '</div>' +
    '</action-menu-wrapper>',
  directives: [NgFor, NgIf, TapClick, Icon]
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

/**
 * TODO
 */
@Injectable()
export class ActionMenu extends Overlay {
  /**
   * Create and open a new Action Menu. This is the
   * public API, and most often you will only use ActionMenu.open()
   *
   * @param {Object} [opts={}]  TODO
   * @return {Promise} Promise that resolves when the action menu is open.
   */
  open(opts={}) {
    let config = this.config;
    let defaults = {
      enterAnimation: config.setting('actionMenuEnter'),
      leaveAnimation: config.setting('actionMenuLeave'),
      cancelIcon: config.setting('actionMenuCancelIcon'),
      destructiveIcon: config.setting('actionMenuDestructiveIcon')
    };

    let context = util.extend(defaults, opts);

    return this.create(OVERLAY_TYPE, ActionMenuDirective, context, context);
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  get() {
    return this.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'action-menu';


/**
 * Animations for action sheet
 */
class ActionMenuAnimation extends Animation {
  constructor(element) {
    super(element);
    this.easing('cubic-bezier(.36, .66, .04, 1)').duration(450);

    this.backdrop = new Animation(element.querySelector('backdrop'));
    this.wrapper = new Animation(element.querySelector('action-menu-wrapper'));

    this.add(this.backdrop, this.wrapper);
  }
}

class ActionMenuSlideIn extends ActionMenuAnimation {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', 0.01, 0.4);
    this.wrapper.fromTo('translateY', '100%', '0%');
  }
}
Animation.register('action-menu-slide-in', ActionMenuSlideIn);

class ActionMenuSlideOut extends ActionMenuAnimation {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', 0.4, 0.01);
    this.wrapper.fromTo('translateY', '0%', '100%');
  }
}
Animation.register('action-menu-slide-out', ActionMenuSlideOut);


class ActionMenuMdSlideIn extends ActionMenuSlideIn {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', 0.01, 0.26);
  }
}
Animation.register('action-menu-md-slide-in', ActionMenuMdSlideIn);

class ActionMenuMdSlideOut extends ActionMenuSlideOut {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', 0.26, 0.01);
  }
}
Animation.register('action-menu-md-slide-out', ActionMenuMdSlideOut);
