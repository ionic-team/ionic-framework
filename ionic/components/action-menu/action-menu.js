import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {Promise} from 'angular2/src/facade/async';
import {isPresent, Type} from 'angular2/src/facade/lang';

import {Component, Directive, Item, Icon} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

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
  constructor(
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement
    this.config = ActionMenu.config.invoke(this)
  }

  static open(opts) {
    console.log('Opening menu', opts);
  }

}

new IonicComponent(ActionMenu, {})
