import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {Tabs} from './tabs';
import {Content} from '../content/content';
import {IonicComponent} from 'ionic/config/component';
import {NavBase} from '../nav/nav-base';


let tabId = -1;

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
    'ariaHidden': 'attr.aria-hidden',
    'isSelected': 'class.show-tab'
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
  directives: [ContentAnchor]
})
export class Tab {
  constructor(
    @Parent() tabs: Tabs,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    this.navBase = new NavBase(elementRef, loader, injector);

    this.navBase.navbarContainerRef = tabs.navbarContainerRef;

    this.domElement = elementRef.domElement;

    this.id = ++tabId;
    this.panelId = 'tab-panel-' + this.id;
    this.labeledBy = 'tab-button-' + this.id;

    tabs.addTab(this);
    console.log('Tab constructor')
  }

  onInit() {
    if (this.initial) {
      console.log('Tab onInit')
      this.navBase.push(this.initial);
    }
  }

  select(isSelected) {
    this.isSelected = isSelected;
    this.ariaHidden = !isSelected;
  }

}


@Directive({
  selector: '[content-anchor]'
})
class ContentAnchor {
  constructor(@Parent() tab: Tab, elementRef: ElementRef) {
    tab.navBase.contentElementRef = elementRef;
  }
}
