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
import {raf, ready} from 'ionic/util/dom'
import * as util from 'ionic/util'

import {Animation} from 'ionic/animations/animation';


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
Animation.register('action-menu-slide-out', ActionMenuSlideIn);

@Component({
  selector: 'ion-action-menu'
})
@View({
  template: `
    <div class="action-menu-backdrop">
      <div class="action-menu-wrapper">
        <div class="action-menu-container">
          <div class="action-menu-group action-menu-options">
            <div class="action-menu-title" *ng-if="titleText">{{titleText}}</div>
            <button (click)="buttonClicked(index)" *ng-for="#b of buttons; #index = index" class="button action-menu-option">{{b.text}}</button>
            <button *ng-if="destructiveText" (click)="destructiveButtonClicked()" class="button destructive action-menu-destructive">{{destructiveText}}</button>
          </div>
          <div class="action-menu-group action-menu-cancel" *ng-if="cancelText">
            <button class="button" (click)="cancel()">{{cancelText}}</button>
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

    console.log('ActionMenu: Component Created', this.domElement);
  }

  close() {
    raf(() => {
      var backdrop = this.domElement.children[0].classList.remove('active');
      var slideOut = Animation.create(this.wrapperEl, 'action-menu-slide-out');

      return slideOut.play().then(() => {
        this.wrapperEl.classList.remove('action-menu-up');
      })
    });
  }

  open() {
    raf(() => {
      var backdrop = this.domElement.children[0].classList.add('active');
      var slideIn = Animation.create(this.wrapperEl, 'action-menu-slide-in');

      return slideIn.play().then(() => {
        this.wrapperEl.classList.add('action-menu-up');
      })
    });
  }

  setOptions(opts) {
    util.extend(this, opts);
  }

  // Overridden by options
  destructiveButtonClicked() {}
  buttonClicked(index) {}
  cancel() {}

  static open(opts) {
    console.log('Opening menu', opts, Ionic);

    var promise = new Promise(resolve => {
      ActionMenu._inject().then((actionMenu) => {
        actionMenu.setOptions(opts);
        setTimeout(() => {
          actionMenu.open();
        })
        resolve(actionMenu);
      });
    })

    return promise;
  }

  static _inject() {
    return Ionic.appendToRoot(ActionMenu);
  }

}

new IonicComponent(ActionMenu, {})
