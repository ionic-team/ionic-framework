import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl'
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Compiler} from 'angular2/angular2';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {Tabs} from './tabs';
import {ViewItem} from '../view/view-item';
import {Content} from '../content/content';
import {IonicComponent} from '../../config/component';


@Component({
  selector: 'ion-tab',
  properties: [
    'initial',
    'tabTitle',
    'tabIcon'
  ],
  hostProperties: {
    'panelId': 'attr.id',
    'labeledBy': 'attr.aria-labelledby',
    '!isSelected': 'attr.aria-hidden',
    'isSelected': 'class.tab-selected'
  },
  hostAttributes: {
    'role': 'tabpanel'
  }
})
@View({
  template: `
    <template pane-anchor></template>
    <content></content>
  `,
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

    // the navbar is already provided by the container of Tabs, which contains Tab
    // Views which come into this Tab should not create their own navbar, but use the parent's
    this.parentNavbar(true);

    let item = this.item = new ViewItem(tabs.parent);
    item.setInstance(this);
    item.setViewElement(elementRef.domElement);
    tabs.addTab(this.item);

    this.panelId = 'tab-panel-' + item.id;
    this.labeledBy = 'tab-button-' + item.id;
  }

  onInit() {
    if ( this.item._initial ) {
      this.tabs.select(this);
    }
  }

  loadInitial(callback) {
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

  get isSelected() {
    return this.tabs.isActive(this.item);
  }

}


@Directive({
  selector: 'template[pane-anchor]'
})
class TabPaneAnchor {
  constructor(@Parent() tab: Tab, elementRef: ElementRef) {
    tab.panes.setAnchor(elementRef);
  }
}
