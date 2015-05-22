import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';

import {Tabs} from 'ionic/components/tabs/tabs';
import * as util from 'ionic/util';
import {IonicComponent} from 'ionic/config/component';


@Component({
  selector: 'ion-tab',
  properties: {
    title: 'tab-title',
    icon: 'tab-icon',
    initial: 'initial'
  }
})
@View({
  template: `
    <section class="nav-item-container">
      <template content-anchor></template>
    </section>
  `
})
export class Tab {
  constructor(
    elementRef: ElementRef,
    @Ancestor() tabs: Tabs
  ) {
    // this.nav = new NavBase(element);
    // this.domElement = element.domElement;

    // let setHidden = (v) => this.domElement.classList[v?'add':'remove']('hide');
    // let setRole = (v) => this.domElement.setAttribute('role', v);
    // let setId = (v) => this.domElement.setAttribute('id', v);
    // let setLabelby = (v) => this.domElement.setAttribute('aria-labelledby', v);

    // this.config = Tab.config.invoke(this);
    // this.setHidden = setHidden;

    // this.tabId = util.nextUid();
    // setId('tab-content-' + this.tabId);
    // setLabelby('tab-item-' + this.tabId);
    // setRole('tabpanel');

    // this.setSelected(false);
    tabs.addTab(this);
  }

  set initial(value) {
    this.nav.initial = value;
  }

  setSelected(isSelected) {
    this.isSelected = !!isSelected;
    //this.setHidden(!this.isSelected);
  }

}

new IonicComponent(Tab, {});
