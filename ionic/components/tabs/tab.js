import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl'
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Compiler} from 'angular2/angular2';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {Nav} from '../nav/nav';
import {NavBase} from '../nav/nav-base';
import {NavItem} from '../nav/nav-item';
import {Tabs} from './tabs';
import {Content} from '../content/content';
import {IonicComponent} from 'ionic/config/component';


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
    <template content-anchor></template>
    <content></content>
  `,
  directives: [TabContentAnchor]
})
export class Tab {
  constructor(
      @Parent() tabs: Tabs,
      compiler: Compiler,
      elementRef: ElementRef,
      loader: DynamicComponentLoader,
      injector: Injector,
      viewContainerRef: ViewContainerRef
    ) {

    this.navBase = new NavBase(tabs.navBase, compiler, elementRef, loader, injector);
    if (tabs.navBase.parent) {
      this.sections = tabs.navBase.parent.panes['_n'].sections;
    }

    this.item = new NavItem(this.navBase);
    this.item.setInstance(this);
    this.item.setViewElement(elementRef.domElement);
    tabs.add(this.item);
    this.tabs = tabs;

    this.panelId = 'tab-panel-' + this.item.id;
    this.labeledBy = 'tab-button-' + this.item.id;

    this.elementRef = elementRef;

    this.viewContainerRef = viewContainerRef;

    this.navBase.panes['_n'] = this;

    this.domElement = elementRef.domElement;
    this.config = Nav.config.invoke(this);
  }

  onInit() {
    if ( this.tabs.navBase.isActive(this.item) || this.tabs.navBase.isStagedEntering(this.item) ) {
      this.loadInitial();
    }
  }

  loadInitial() {
    if (this.initial && !this._loaded) {
      this.navBase.initial(this.initial);
      this._loaded = true;
    }
  }

  get isSelected() {
    return this.tabs.navBase.isActive(this.item);
  }

}


@Directive({
  selector: 'template[content-anchor]'
})
class TabContentAnchor {
  constructor(@Parent() tab: Tab, viewContainerRef: ViewContainerRef) {
    tab.contentContainerRef = viewContainerRef;
  }
}
