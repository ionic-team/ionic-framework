import {
  Component,
  NgElement,
  View,
  Ancestor,
  For,
  If,
} from 'angular2/angular2';
import {bind} from 'angular2/di';

import {NavInjectable} from 'ionic/components/nav/nav';
import {NavBase} from 'ionic/components/nav/nav-base';
import {NavItem} from 'ionic/components/nav/nav-item';
import {Tabs} from 'ionic/components/tabs/tabs';
import * as util from 'ionic/util';
import {IonicComponent} from 'ionic/config/component';
import {ToolbarContainer} from 'ionic/components/toolbar/toolbar';

/*
 * See components/nav/nav for an explanation of NavInjectable.
 * Allow a tab to publish itself on the injector in a similar manner.
 */
class TabNavInjectable {}

@Component({
  selector: 'ion-tab',
  properties: {
    title: 'tab-title',
    icon: 'tab-icon',
    initial: 'initial'
  },
  injectables: [
    // Child components will inject `NavInjectable` but it will get the tabs one.
    bind(NavInjectable).toClass(TabNavInjectable)
  ]
})
@View({
  template: `
  <header class="toolbar-container" [class.hide]="nav.getToolbars('top').length == 0">
    <div *for="#toolbar of nav.getToolbars('top')" [toolbar-create]="toolbar">
    </div>
  </header>
  <section class="nav-item-container">
    <div class="nav-item"
         *for="#item of nav.navItems"
         [item]="item"></div>
  </section>
  <footer class="toolbar-container" [class.hide]="nav.getToolbars('bottom').length == 0">
    <div *for="#toolbar of nav.getToolbars('bottom')" [toolbar-create]="toolbar">
    </div>
  </footer>
  `,
  directives: [NavItem, For, If, ToolbarContainer]
})
export class Tab {
  constructor(
    element: NgElement,
    navInjectable: NavInjectable,
    @Ancestor() tabs: Tabs
    // @PropertySetter('class.hide') setHidden: Function,
    // @PropertySetter('attr.role') setRole: Function,
    // @PropertySetter('attr.id') setId: Function,
    // @PropertySetter('attr.aria-labelledby') setLabelby: Function
  ) {
    this.nav = new NavBase(element);
    this.domElement = element.domElement;

    // Allow children to get this nav instance from injecting the NavInjectable
    navInjectable.nav = this.nav;

    let setHidden = (v) => this.domElement.classList[v?'add':'remove']('hide');
    let setRole = (v) => this.domElement.setAttribute('role', v);
    let setId = (v) => this.domElement.setAttribute('id', v);
    let setLabelby = (v) => this.domElement.setAttribute('aria-labelledby', v);

    this.config = Tab.config.invoke(this);
    this.setHidden = setHidden

    this.tabId = util.nextUid()
    setId('tab-content-' + this.tabId)
    setLabelby('tab-item-' + this.tabId)
    setRole('tabpanel')

    this.setSelected(false)
    tabs.addTab(this)
  }

  set initial(value) {
    this.nav.initial = value;
  }

  setSelected(isSelected) {
    this.isSelected = !!isSelected
    this.setHidden(!this.isSelected)
  }
}

new IonicComponent(Tab, {})
