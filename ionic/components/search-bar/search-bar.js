import {ElementRef, Pipe} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-search-bar',
  properties: {
    cancelText: 'cancel-text',
    placeholderText: 'placeholder-text',
    list: 'list',
    query: 'query'
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
    setTimeout(() => {
      console.log('Search bar for list', this.list);
      this.query = 'Cats';
    })
  }
}

export class SearchPipe extends Pipe {
  constructor() {
    super();
    this.state = 0;
  }

  supports(newValue) {
    return true;
  }

  transform(value) {
    console.log('Transforming', value);
    return value;
    //return `${value} state:${this.state ++}`;
  }

  create(cdRef) {
    console.log('REF', cdRef);
    return new SearchPipe(cdRef);
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
