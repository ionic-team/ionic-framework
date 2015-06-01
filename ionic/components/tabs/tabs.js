import {Parent} from 'angular2/src/core/annotations_impl/visibility';
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
    <header class="navbar-container">
      <template navbar-anchor></template>
    </header>
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
  directives: [NgFor, TabButton, Icon, NavbarAnchor]
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


@Directive({
  selector: '[navbar-anchor]'
})
class NavbarAnchor {
  constructor(@Parent() tabs: Tabs, viewContainerRef: ViewContainerRef) {
    console.log('Tabs NavbarAnchor', viewContainerRef)
    tabs.navbarContainerRef = viewContainerRef;
  }
}
