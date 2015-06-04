import {Ancestor, Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Optional} from 'angular2/src/di/annotations_impl'
import {Directive, Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {NgFor} from 'angular2/angular2';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {IonicComponent} from '../../config/component';
import {Tab} from './tab';
import {TabButton} from './tab-button';
import {Icon} from '../icon/icon';
import {Nav, NavPane} from '../nav/nav';
import {NavItem} from '../nav/nav-item';


let tabsId = -1;

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
      <div class="tab-bar" role="tablist">
        <button *ng-for="#t of tabs" [tab]="t" class="tab-button" role="tab">
          <icon [name]="t.tabIcon" class="tab-button-icon"></icon>
          <span class="tab-button-text">{{t.tabTitle}}</span>
        </button>
      </div>
    </nav>
    <section class="content-container">
      <content></content>
    </section>
  `,
  directives: [NgFor, TabButton, Icon]
})
export class Tabs {
  constructor(elementRef: ElementRef) {
    this.id = ++tabsId;
    this.tabIds = 0;
    this.tabs = [];
    this._selected = null;

    this.domElement = elementRef.domElement;
    this.config = Tabs.config.invoke(this);

    console.log('Tabs constructor', this.id);
  }

  onInit() {
    if (this.tabs.length > 0) {
      this.selectTab(this.tabs[0]);
    }
  }

  addTab(tab) {
    tab.id = this.id + '' + (++this.tabIds);
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

    let tabToDeselect = this._selected;

    this.tabs.forEach(tab => {
      tab.select( (tab === tabToSelect) );
    });

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
