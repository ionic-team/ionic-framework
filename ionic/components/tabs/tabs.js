import {Optional} from 'angular2/src/di/annotations_impl'
import {Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
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
import {IonicComponentNEW} from '../../config/component';


@IonicComponentNEW(Tabs)
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

    // Tabs may also be an actual ViewItem which was navigated to
    // if Tabs is static and not navigated to within a ViewController
    // then skip this and don't treat it as it's own ViewItem
    if (viewItem) {
      this.item = viewItem;

      // special overrides for the Tabs ViewItem
      // the Tabs ViewItem does not have it's own navbar
      // so find the navbar it should use within it's active Tab
      viewItem.navbarView = () => {
        let activeTab = this.getActive();
        if (activeTab && activeTab.instance) {
          return activeTab.instance.navbarView();
        }
      };

      // a Tabs ViewItem should not have a back button
      // enableBack back button will later be determined
      // by the active ViewItem that has a navbar
      viewItem.enableBack = () => {
        return false;
      };
    }

  }

  onInit() {
    Tabs.applyConfig(this);
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

  static get config() {
    return {
      selector: 'ion-tabs',
      defaultProperties: {
        'tabBarPlacement': 'bottom',
        'tabBarIcons': 'top'
      }
    }
  }

}
