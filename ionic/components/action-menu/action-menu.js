import {DynamicComponentLoader, ComponentLaoder, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
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

import {Animation} from 'ionic/animations/animation';


@Component({
  selector: 'ion-action-menu'
})
@View({
  template: `
    <div class="overlay-backdrop"></div>
    <div class="overlay-container">
      <div class="action-menu-container">

        <div class="list-header">Action Menu List Header</div>
        <div class="list">
          <button ion-item class="item">
            Button 1
          </button>
          <button ion-item class="item">
            Button 2
          </button>
        </div>

        <div class="list-header">Action Menu Label</div>
        <div class="list">
          <button ion-item class="item">Button 1</button>
          <button ion-item class="item">Button 2</button>
        </div>

        <div class="list">
          <button ion-item class="item">Button 1</button>
        </div>

      </div>
    </div>`,
  directives: [Item,Icon]
})
export class ActionMenu {
  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement
    this.config = ActionMenu.config.invoke(this)
    console.log('ActionMenu: Component Created', this.domElement);
  }

  static open(opts) {
    console.log('Opening menu', opts, Ionic);

    ActionMenu._inject();
  }

  static _inject() {
    Ionic.appendToRoot(ActionMenu).then(() => {
      console.log('Action Menu appended');
    })
  }

}

new IonicComponent(ActionMenu, {})
