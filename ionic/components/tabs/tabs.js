import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {NgFor} from 'angular2/angular2';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {NavBase} from 'ionic/components/nav/nav-base';
import {IonicComponent} from 'ionic/config/component';
import {Tab} from 'ionic/components/tabs/tab';


@Component({
  selector: 'ion-tabs',
  properties: {
    tabBarPlacement: 'tab-bar-placement',
    tabBarIcons: 'tab-bar-icons'
  }
})
@View({
  template: `
    <nav class="toolbar-container tab-bar-container">
      <div class="tab-bar">
        <button *ng-for="#t of tabs"
          role="tab"
          class="tab-bar-item"
          [attr.id]="'tab-item-' + t.tabId"
          [attr.aria-controls]="'tab-content-' + t.tabId"
          [attr.aria-selected]="t.isSelected"
          [style.color]="t.isSelected ? 'red' : ''"
          (^click)="onClickTabItem($event, t)">
            <icon [class-name]="'tab-bar-item-icon ' + t.icon" [hidden]="!t.icon"></icon>
            <span class="tab-bar-item-text" [hidden]="!t.title">{{t.title}}</span>
        </button>
      </div>
    </nav>
    <section class="tab-item-container">
      <content></content>
    </section>
  `,
  directives: [NgFor]
})
export class Tabs extends NavBase {
  constructor(elementRef: ElementRef, loader: DynamicComponentLoader, injector: Injector) {
    super(loader, injector);
    this.domElement = elementRef.domElement;
    this.config = Tabs.config.invoke(this);

    this.tabs = [];
  }

  addTab(tab) {
    this.tabs.push(tab);
    if (this.tabs.length == 1) {
      this.select(tab);
    }
  }

  select(tab) {
    this.tabs.forEach(otherTab => {
      otherTab.setSelected(false);
    });

    tab.setSelected(true);
    this.selectedTab = tab;
  }

  onClickTabItem(ev, tab) {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.selectedTab !== tab) {
      this.select(tab);
    }
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
