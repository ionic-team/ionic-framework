import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component} from 'angular2/src/core/annotations_impl/annotations';
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
      @Optional() parentNavBase: NavBase,
      compiler: Compiler,
      elementRef: ElementRef,
      loader: DynamicComponentLoader,
      injector: Injector,
      viewContainerRef: ViewContainerRef
    ) {

    this.navBase = new NavBase(parentNavBase, compiler, elementRef, loader, injector);
    this.parentNavBase = parentNavBase;

    this.tabItem = new NavItem(parentNavBase);
    this.tabItem.instance = this
    tabs.addTab(this.tabItem);

    this.panelId = 'tab-panel-' + this.tabItem.id;
    this.labeledBy = 'tab-button-' + this.tabItem.id;

    this.elementRef = elementRef;

    this.viewContainerRef = viewContainerRef;

    this.sections = parentNavBase.panes['_n'].sections;
    this.navBase.panes['_n'] = this;


    this.domElement = elementRef.domElement;
    this.config = Nav.config.invoke(this);

    console.log('Tab constructor', this.id, ' parentNavBase:', parentNavBase);
  }

  get isSelected() {
    return this.parentNavBase.isActive(this);
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
