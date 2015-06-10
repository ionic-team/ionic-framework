import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';

import {IonicComponent} from 'ionic/config/component';
import {ViewItem} from '../view/view-item';


@Component({
  selector: 'back-button',
  hostProperties: {
    '!item.enableBack': 'hidden'
  },
  hostListeners: {
    '^click': 'goBack($event)'
  },
})
@View({
  template: `
    <icon class="back-button-icon ion-ios-arrow-back"></icon>
    <span class="back-button-text">
      <span class="back-default">Back</span>
      <span class="back-title"></span>
    </span>`
})
export class BackButton {
  constructor(item: ViewItem, @ElementRef() element: ElementRef) {
    this.item = item;
    this.domElement = element.domElement;

    setTimeout(() => {
      // HACK!
      this.config = BackButton.config.invoke(this);
    });
  }

  goBack(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    let item = this.item;
    item && item.viewCtrl && item.viewCtrl.pop();
  }
}

new IonicComponent(BackButton, {
  properties: {
    icon: {
      defaults: {
        ios: 'ion-ios-arrow-back',
        android: 'ion-android-arrow-back',
        core: 'ion-chevron-left'
      }
    },
    text: {
      defaults: {
        ios: 'Back',
        android: '',
        core: ''
      }
    }
  }
});
