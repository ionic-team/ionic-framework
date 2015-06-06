import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl'
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Compiler} from 'angular2/angular2';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {Tabs} from './tabs';
import {NavBase} from '../nav/nav-base';
import {NavItem} from '../nav/nav-item';
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
    <template content-anchor></template>
    <content></content>
  `,
  directives: [TabContentAnchor]
})
export class Tab extends NavBase {

  constructor(
    @Parent() tabs: Tabs,
    compiler: Compiler,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector,
    viewContainerRef: ViewContainerRef
  ) {

    super(tabs, compiler, elementRef, loader, injector);
    if (tabs.parent) {
      this.sections = tabs.parent.panes['_n'].sections;
    }

    this.item = new NavItem(this);
    this.item.setInstance(this);
    this.item.setViewElement(elementRef.domElement);
    tabs.addTab(this.item);
    this.tabs = tabs;

    this.panelId = 'tab-panel-' + this.item.id;
    this.labeledBy = 'tab-button-' + this.item.id;

    this.elementRef = elementRef;

    this.viewContainerRef = viewContainerRef;

    this.panes['_n'] = this;

    this.domElement = elementRef.domElement;
  }

  onInit() {
    if ( this.tabs.isActive(this.item) || this.tabs.isStagedEntering(this.item) ) {
      this.loadInitial();
    }
  }

  loadInitial() {
    if (this.initial && !this._loaded) {
      this.push(this.initial);
      this._loaded = true;
    }
  }

  get isSelected() {
    return this.tabs.isActive(this.item);
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
