import {
  Component,
  NgElement,
  View as NgView,
  Ancestor,
  PropertySetter,
  For
} from 'angular2/angular2';
import {NavControllerBase} from 'ionic/components/nav/nav-controller';
import {NavItem} from 'ionic/components/nav/nav-item';
import {Tabs} from 'ionic/components/tabs/tabs';
import * as util from 'ionic/util';
import {IonicComponent} from 'ionic/config/component';

@Component({
  selector: 'ion-tab',
  properties: {
    title: 'tab-title',
    icon: 'tab-icon',
    initial: 'initial'
  },
})
@NgView({
  template: `
    <header class="toolbar-container">
      <ion-toolbar class="view-toolbar">
        <ion-nav-title>
          Test Nonfunctional Toolbar
        </ion-nav-title>
      </ion-toolbar>
    </header>
    <div class="nav-item-container">
      <!-- COLLECTION OF PANES WITHIN THIS NAV-VIEWPORT, EACH PANE AS ONE VIEW -->
      <!-- EACH VIEW HAS A TOOLBAR WHICH NEEDS TO HAVE THE SAME CONTEXT -->
      <ion-nav-item class="nav-pane" *for="#item of _ngForLoopArray" [item]="item"></section>
    </div>
  `,
  directives: [For, NavItem]
})
export class Tab extends NavControllerBase {
  constructor(
    element: NgElement,
    @Ancestor() tabs: Tabs,
    @PropertySetter('class.hide') setHidden: Function,
    @PropertySetter('attr.role') setRole: Function,
    @PropertySetter('attr.id') setId: Function,
    @PropertySetter('attr.aria-labelledby') setLabelby: Function
  ) {
    super(element);
    this.config = Tab.config.invoke(this);
    this.setHidden = setHidden

    this.tabId = util.nextUid()
    setId('tab-content-' + this.tabId)
    setLabelby('tab-item-' + this.tabId)
    setRole('tabpanel')

    this.setSelected(false)
    tabs.addTab(this)
  }

  setSelected(isSelected) {
    this.isSelected = !!isSelected
    this.setHidden(!this.isSelected)
  }
}

new IonicComponent(Tab, {})
