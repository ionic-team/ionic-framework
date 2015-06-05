import {Ancestor, Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Optional} from 'angular2/src/di/annotations_impl'
import {Directive, Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Compiler} from 'angular2/angular2';
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
import {NavBase} from '../nav/nav-base';


@Component({
  selector: 'ion-tabs',
  properties: [
    'tabBarPlacement',
    'tabBarIcons'
  ]
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
  constructor(
    @Optional() parentNavBase: NavBase,
      compiler: Compiler,
      elementRef: ElementRef,
      loader: DynamicComponentLoader,
      injector: Injector
  ) {
    this.navBase = new NavBase(parentNavBase, compiler, elementRef, loader, injector);

    this.domElement = elementRef.domElement;
    this.config = Tabs.config.invoke(this);
  }

  add(tabItem) {
    this.navBase.add(tabItem);

    if (this.navBase.length() === 1) {
      this.select(0);
    }
  }

  get tabs() {
    return this.navBase.instances();
  }

  select(tab) {
    let item = null;
    if (typeof tab === 'number') {
      item = this.navBase.getByIndex(tab);
    } else {
      item = this.navBase.getByInstance(tab)
    }
    this.navBase.select(item);
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
