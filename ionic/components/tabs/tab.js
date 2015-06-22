import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl'
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Compiler} from 'angular2/angular2';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {ViewItem} from '../view/view-item';
import {Tabs} from './tabs';
import {Content} from '../content/content';


@Component({
  selector: 'ion-tab',
  properties: [
    'initial',
    'tabTitle',
    'tabIcon'
  ],
  host: {
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'labeledBy',
    '[attr.aria-hidden]': '!isSelected',
    '[class.tab-selected]': 'isSelected',
    'role': 'tabpanel'
  }
})
@View({
  template: '<template pane-anchor></template><content></content>',
  directives: [TabPaneAnchor]
})
export class Tab extends ViewController {

  constructor(
    @Parent() tabs: Tabs,
    compiler: Compiler,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    // A Tab is both a container of many views, and is a view itself.
    // A Tab is one ViewItem within it's parent Tabs (which extends ViewController)
    // A Tab is a ViewController for its child ViewItems
    super(tabs, compiler, elementRef, loader, injector);
    this.tabs = tabs;

    this.childNavbar(true);

    let item = this.item = new ViewItem(tabs.parent);
    item.setInstance(this);
    item.viewElement(elementRef.domElement);
    tabs.addTab(this);

    this.navbarView = item.navbarView = () => {
      let activeItem = this.getActive();
      return activeItem && activeItem.navbarView();
    };

    this.panelId = 'tab-panel-' + item.id;
    this.labeledBy = 'tab-button-' + item.id;
  }

  onInit() {
    if (this._initialResolve) {
      this.tabs.select(this).then(() => {
        this._initialResolve();
        this._initialResolve = null;
      });
    }
  }

  load(callback) {
    if (!this._loaded && this.initial) {
      let opts = {
        animate: false,
        navbar: false
      };
      this.push(this.initial, null, opts).then(() => {
        callback && callback();
      });
      this._loaded = true;

    } else {
      callback && callback();
    }
  }

  queueInitial() {
    // this Tab will be used as the initial one for the first load of Tabs
    return new Promise(res => { this._initialResolve = res; });
  }

  get isSelected() {
    return this.tabs.isActive(this.item);
  }

}


@Directive({
  selector: 'template[pane-anchor]'
})
class TabPaneAnchor {
  constructor(@Parent() tab: Tab, elementRef: ElementRef) {
    tab.anchorElementRef(elementRef);
  }
}
