import {NgElement, Component, Template} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config';

export let SearchBarConfig = new ComponentConfig('search-bar')

@Component({
  selector: 'ion-search-bar',
  bind: {
    cancelText: 'cancel-text',
    placeholderText: 'placeholder-text'
  },
  services: [SearchBarConfig]
})
@Template({
  inline: `<div class="search-bar-input-container">
             <input class="search-bar-input" type="search" [placeholder]="placeholderText">
           </div>
           <button class="button search-bar-cancel">{{ cancelText }}</button>`
})
export class SearchBar {
  constructor(
    configFactory: SearchBarConfig,
    ngElement: NgElement
  ) {
    this.domElement = ngElement.domElement;
    configFactory.create(this);

    // Defaults
    this.cancelText = this.cancelText || 'Cancel'
    this.placeholderText = this.placeholderText || 'Search'
  }
}

