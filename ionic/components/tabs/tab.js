import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';

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
    'ariaHidden': 'attr.aria-hidden',
    'isSelected': 'class.show-tab'
  },
  hostAttributes: {
    'role': 'tabpanel'
  }
})
@View({
  template: `
    <template tab-anchor></template>
    <content></content>
  `,
  directives: [TabAnchor]
})
export class Tab {
  constructor(@Parent() tabs: Tabs, elementRef: ElementRef) {
    this.domElement = elementRef.domElement;

    tabs.addTab(this);
    this.panelId = 'tab-panel-' + this.id;
    this.labeledBy = 'tab-button-' + this.id;

    console.log('Tab constructor', this.id);
  }

  onInit() {
    if (this.initial) {
      // console.log('Tab onInit')
      // this.navBase.push(this.initial);
    }
  }

  select(isSelected) {
    this.isSelected = isSelected;
    this.ariaHidden = !isSelected;
  }

}


@Directive({
  selector: 'template[tab-anchor]'
})
class TabAnchor {
  constructor(@Parent() tab: Tab, elementRef: ElementRef) {
    console.log('TabAnchor constructor', tab.id)
  }
}
