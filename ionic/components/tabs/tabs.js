import {Optional} from 'angular2/src/di/annotations_impl'
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Compiler} from 'angular2/angular2';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {NgFor} from 'angular2/angular2';

import {ViewController} from '../view/view-controller';
import {ViewItem} from '../view/view-item';
import {TabButton} from './tab-button';
import {Icon} from '../icon/icon';
import {IonicComponent} from '../../config/component';
import {ModeComponent} from '../../config/component';
import {Config} from '../../config/component';


@ModeComponent({
  selector: 'ion-tabs',
  properties: [
    'tabBarPlacement',
    'tabBarIcons'
  ],
  hostProperties: {
    'tabBarPlacement': 'attr.tab-bar-placement',
    'tabBarIcons': 'attr.tab-bar-icons'
  },
  classId: 'tabs'
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
export class Tabs extends ViewController {

  constructor(
    @Optional() parentViewCtrl: ViewController,
    @Optional() viewItem: ViewItem,
    compiler: Compiler,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    super(parentViewCtrl, compiler, elementRef, loader, injector);
    this.item = viewItem;

    this.item.navbarView = () => {
      let activeTab = this.getActive();
      if (activeTab && activeTab.instance) {
        return activeTab.instance.navbarView();
      }
      return {};
    };

    this.childNavbar(true);

    Config(this, {
      'tabBarPlacement': {
        'default': 'bottom',
        'android': 'top',
        'ios': 'bottom'
      }
    });
  }

  addTab(tab) {
    // tab.item refers to the ViewItem of the individual Tab being added to Tabs (ViewController)
    // this.item refers to the ViewItem instsance on Tabs
    this.add(tab.item);

    if (this.length() === 1) {
      // this was the first tab added, queue this one to be loaded and selected
      let promise = tab.queueInitial();
      this.item && this.item.addPromise(promise);
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
      return Promise.reject();
    }

    return new Promise(resolve => {
      enteringItem.instance.load(() => {
        let opts = {
          animate: false
        };

        let leavingItem = this.getActive() || new ViewItem();
        leavingItem.shouldDestroy = false;
        leavingItem.shouldCache = true;
        leavingItem.willCache();

        this.transition(enteringItem, leavingItem, opts, () => {
          resolve();
        });
      });

    });
  }

  get tabs() {
    return this.instances();
  }

}
