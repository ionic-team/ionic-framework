/**
* @ngdoc service
* @name ActionMenu
* @module ionic
* @description
* The ActionMenu is a modal menu with options to select based on an action.
*/

import {NgIf, NgFor} from 'angular2/angular2';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Item, Icon} from 'ionic/ionic';
import {IonicRoot} from '../app/app';
import * as util from 'ionic/util';

import {Overlay} from '../overlay/overlay';
import {IonicComponentNew} from '../../config/component';
import {Animation} from 'ionic/animations/animation';
import {ClickBlock} from '../../util/click-block';


@IonicComponentNew(ActionMenu)
@View({
  template: `
    <div class="action-menu-backdrop" (click)="cancel()"></div>
    <div class="action-menu-wrapper">
      <div class="action-menu-container">
        <div class="action-menu-group action-menu-options">
          <div class="action-menu-title" *ng-if="options.titleText">{{options.titleText}}</div>
          <button (click)="_buttonClicked(index)" *ng-for="#b of options.buttons; #index = index" class="button action-menu-option">{{b.text}}</button>
          <button *ng-if="options.destructiveText" (click)="_destructiveButtonClicked()" class="button destructive action-menu-destructive">{{options.destructiveText}}</button>
        </div>
        <div class="action-menu-group action-menu-cancel" *ng-if="options.cancelText">
          <button class="button" (click)="cancel()">{{options.cancelText}}</button>
        </div>
      </div>
    </div>`,
  directives: [Item, Icon, NgIf, NgFor]
})
export class ActionMenu extends Overlay {
  constructor() {
    super();

    this.setOptions({
      enterAnimation: 'action-menu-slide-in',
      leaveAnimation: 'action-menu-slide-out'
    });

    this.options = {
      destructiveButtonClicked: util.noop,
      buttonClicked: util.noop,
      cancel: util.noop
    };
  }

  cancel() {
    this.options.cancel();
    this.close();
  }

  _destructiveButtonClicked() {
    let shouldClose = this.options.destructiveButtonClicked();
    if (shouldClose === true) {
      return this.close();
    }
  }

  _buttonClicked(index) {
    let shouldClose = this.options.buttonClicked(index);
    if (shouldClose === true) {
      return this.close();
    }
  }

  /**
   * Create and open a new Action Menu. This is the
   * public API, and most often you will only use ActionMenu.open()
   *
   * @return Promise that resolves when the action menu is open.
   */
  static open(opts) {
    return this.create(ActionMenu, opts);
  }

  static get config() {
    return {
      selector: 'ion-action-menu'
    }
  }
}


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
