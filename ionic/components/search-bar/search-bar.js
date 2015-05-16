import {ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-search-bar',
  properties: {
    cancelText: 'cancel-text',
    placeholderText: 'placeholder-text'
  }
})
@View({
  template: `<div class="search-bar-input-container">
             <input class="search-bar-input" type="search" [attr.placeholder]="placeholderText">
           </div>
           <button class="button search-bar-cancel">{{ cancelText }}</button>`
})
export class SearchBar {
  constructor(
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement
    this.config = SearchBar.config.invoke(this)
  }
}

new IonicComponent(SearchBar, {
  properties: {
    cancelText: {
      defaults: {
        ios: 'Cancel',
        android: 'Cancel',
        core: 'Cancel'
      }
    },
    placeholderText: {
      defaults: {
        ios: 'Search',
        android: 'Search',
        core: 'Search'
      }
    }
  }
})
