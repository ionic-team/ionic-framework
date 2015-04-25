import {NgElement, Component, View as NgView} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-search-bar',
  bind: {
    cancelText: 'cancel-text',
    placeholderText: 'placeholder-text'
  }
})
@NgView({
  template: `<div class="search-bar-input-container">
             <input class="search-bar-input" type="search" [attr.placeholder]="placeholderText">
           </div>
           <button class="button search-bar-cancel">{{ cancelText }}</button>`
})
export class SearchBar {
  constructor(
    ngElement: NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = SearchBar.config.invoke(this)
  }
}

new IonicComponent(SearchBar, {
  bind: {
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
