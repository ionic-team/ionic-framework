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

import {TabButton} from './tab-button';
import {NavBase} from '../nav/nav-base';
import {Icon} from '../icon/icon';
import {NavItem} from '../nav/nav-item';
import {IonicComponent} from '../../config/component';


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
export class Tabs extends NavBase {

  constructor(
    @Optional() parentNavBase: NavBase,
    compiler: Compiler,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    super(parentNavBase, compiler, elementRef, loader, injector);

    this.domElement = elementRef.domElement;
    this.config = Tabs.config.invoke(this);
  }

  addTab(tabItem) {
    this.add(tabItem);

    if (this.length() === 1) {
      this.select(0);
    }
  }

  select(tab) {
    let enteringItem = null;
    if (typeof tab === 'number') {
      enteringItem = this.getByIndex(tab);
    } else {
      enteringItem = this.getByInstance(tab)
    }

    if (!enteringItem || !enteringItem.instance || this.isTransitioning()) {
      return;
    }

    enteringItem.instance.loadInitial(() => {
      let opts = {
        animation: 'none'
      };

      let leavingItem = this.getActive() || new NavItem();
      leavingItem.shouldDestroy = false;
      leavingItem.shouldCache = true;
      leavingItem.willCache();

      this.transition(enteringItem, leavingItem, opts, () => {
        console.log('tab selected')
      });
    });
  }

  get tabs() {
    return this.instances();
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
