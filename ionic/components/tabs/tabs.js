import {Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {NgFor} from 'angular2/angular2';

import {IonicComponent} from '../../config/component';
import {Tab} from './tab';
import {TabButton} from './tab-button';


@Component({
  selector: 'ion-tabs',
  properties: [
    'tabBarPlacement',
    'tabBarIcons'
  ],
  lifecycle: [onInit]
})
@View({
  template: `
    <nav class="navbar-container tab-bar-container">
      <div class="tab-bar">
        <button *ng-for="#t of tabs" [tab]="t" class="tab-button">
          <icon [class-name]="'tab-button-icon ' + t.tabIcon"></icon>
          <span class="tab-button-text">{{t.tabTitle}}</span>
        </button>
      </div>
    </nav>
    <section class="content-container">
      <content></content>
    </section>
  `,
  directives: [NgFor, TabButton]
})
export class Tabs {
  constructor(elementRef: ElementRef, loader: DynamicComponentLoader, injector: Injector) {
    this.domElement = elementRef.domElement;
    this.config = Tabs.config.invoke(this);
    this.tabs = [];
  }

  onInit() {
    if (this.tabs.length > 0) {
      this.selectTab(this.tabs[0]);
    }
  }

  addTab(tab) {
    this.tabs.push(tab);
  }

  selectTab(tabToSelect) {
    if (typeof tabToSelect === 'number') {
      let index = tabToSelect;
      tabToSelect = null;
      if (index < this.tabs.length) {
        tabToSelect = this.tabs[index];
      }
    }
    if (!tabToSelect || this._selected === tabToSelect) return;

    this.tabs.forEach(otherTab => {
      if (otherTab !== tabToSelect) {
        otherTab.select(false);
      }
    });

    tabToSelect.select(true);
    this._selected = tabToSelect;
  }

}

new IonicComponent(Tabs, {
  properties: {
    tabBarPlacement: {
      defaults: {
        ios: 'bottom',
        android: 'top',
        core: 'bottom'
      }
    },
    tabBarIcons: {
      defaults: {
        ios: 'top',
        android: 'top',
        core: 'top'
      }
    }
  }
});
