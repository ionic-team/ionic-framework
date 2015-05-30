/**
* @ngdoc service
* @name ActionMenu
* @module ionic
* @description
* The ActionMenu is a modal menu with options to select based on an action.
*/

import {NgIf, NgFor, DynamicComponentLoader, ComponentLaoder, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {Promise} from 'angular2/src/facade/async';
import {isPresent, Type} from 'angular2/src/facade/lang';

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

import {Item, Icon} from 'ionic/ionic'
import {Ionic} from 'ionic/components/app/app'
import {IonicComponent} from 'ionic/config/component'
import {raf, rafPromise, ready} from 'ionic/util/dom'
import * as util from 'ionic/util'

import {Animation} from 'ionic/animations/animation';

@Component({
  selector: 'ion-action-menu'
})
@View({
  template: `
    <div class="action-menu-backdrop">
      <div class="action-menu-wrapper">
        <div class="action-menu-container">
          <div class="action-menu-group action-menu-options">
            <div class="action-menu-title" *ng-if="options.titleText">{{options.titleText}}</div>
            <button (click)="_buttonClicked(index)" *ng-for="#b of options.buttons; #index = index" class="button action-menu-option">{{b.text}}</button>
            <button *ng-if="options.destructiveText" (click)="_destructiveButtonClicked()" class="button destructive action-menu-destructive">{{options.destructiveText}}</button>
          </div>
          <div class="action-menu-group action-menu-cancel" *ng-if="options.cancelText">
            <button class="button" (click)="_cancel()">{{options.cancelText}}</button>
          </div>
        </div>
      </div>
    </div>`,
  directives: [Item,Icon, NgIf, NgFor]
})
export class ActionMenu {
  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement
    this.config = ActionMenu.config.invoke(this)

    this.wrapperEl = this.domElement.querySelector('.action-menu-wrapper');

    this.options = {
      destructiveButtonClicked: util.noop,
      buttonClicked: util.noop,
      cancel: util.noop
    };

    console.log('ActionMenu: Component Created', this.domElement);
  }

  /**
   * Close the ActionMenu.
   *
   * @return Promise that resolves when the action menu is closed.
   */
  close() {
    return new Promise(resolve => {
      raf(() => {
        var backdrop = this.domElement.children[0].classList.remove('active');
        var slideOut = Animation.create(this.wrapperEl, 'action-menu-slide-out');

        slideOut.play().then(() => {
          this.wrapperEl.classList.remove('action-menu-up');
          this._clean();
          resolve();
        })
      });
    });
  }

  /**
   * Open the Action Menu
   *
   * @return Promise that resolves when the action menu is open.
   */
  open() {
    return new Promise(resolve => {
      raf(() => {
        var backdrop = this.domElement.children[0].classList.add('active');
        var slideIn = Animation.create(this.wrapperEl, 'action-menu-slide-in');

        slideIn.play().then(() => {
          this.wrapperEl.classList.add('action-menu-up');
          resolve();
        })
      });
    });
  }

  /**
   * Set the options (as in show())
   *
   * @param opts the options to set
   */
  setOptions(opts) {
    util.extend(this.options, opts);
  }

  /**
   * Create and open a new Action Menu. This is the
   * public API, and most often you will only use ActionMenu.open()
   *
   * @return Promise that resolves when the action menu is open.
   */
  static open(opts) {
    console.log('Opening menu', opts, Ionic);

    var promise = new Promise(resolve => {
      ActionMenu._inject().then((ref) => {
        let actionMenu = ref.instance;
        actionMenu.ref = ref;
        actionMenu.setOptions(opts);
        actionMenu.open();
        resolve(actionMenu);
      });
    })

    return promise;
  }

  static _inject() {
    return Ionic.appendToRoot(ActionMenu);
  }

  _clean() {
    this.ref.dispose();
  }

  _cancel() {
    this.options.cancel();
    this.close().then(() => {
    });
  }


  _destructiveButtonClicked() {
    let shouldClose = this.options.destructiveButtonClicked();
    if(shouldClose === true) {
      return this.close()
    }
  }

  _buttonClicked(index) {
    let shouldClose = this.options.buttonClicked(index);
    if(shouldClose === true) {
      return this.close()
    }
  }
}

new IonicComponent(ActionMenu, {})

/**
 * Animations for action sheet
 */
class ActionMenuSlideIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('cubic-bezier(.36, .66, .04, 1)')
      .duration(500)
      .from('translateY', '100%')
      .to('translateY', '0%');
  }
}
Animation.register('action-menu-slide-in', ActionMenuSlideIn);

class ActionMenuSlideOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('cubic-bezier(.36, .66, .04, 1)')
      .duration(500)
      .from('translateY', '0%')
      .to('translateY', '100%');
  }
}
Animation.register('action-menu-slide-out', ActionMenuSlideOut);
