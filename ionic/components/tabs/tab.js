import {
  NgElement,
  Component,
  View as NgView,
  Ancestor,
  PropertySetter,
  For
} from 'angular2/angular2';
import {NavViewport} from 'ionic/components/nav-viewport/nav-viewport'
import {NavPane} from 'ionic/components/nav-pane/nav-pane'
import {Tabs} from 'ionic/components/tabs/tabs'
import * as util from 'ionic/util'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-tab',
  bind: {
    title: 'tab-title',
    icon: 'tab-icon',
    initial: 'initial'
  }
})
@NgView({
  template: `
    <div class="nav-pane-container">
      <!-- COLLECTION OF PANES WITHIN THIS NAV-VIEWPORT, EACH PANE AS ONE VIEW -->
      <!-- EACH VIEW HAS A TOOLBAR WHICH NEEDS TO HAVE THE SAME CONTEXT -->
      <section class="nav-pane" *for="#item of _ngForLoopArray" [item]="item"></section>
    </div>
  `,
  directives: [For, NavPane]
})
export class Tab extends NavViewport {
  constructor(
    element: NgElement,
    @Ancestor() tabs: Tabs,
    @PropertySetter('class.hide') setHidden: Function,
    @PropertySetter('attr.role') setRole: Function,
    @PropertySetter('attr.id') setId: Function,
    @PropertySetter('attr.aria-labelledby') setLabelby: Function
  ) {
    super(element)
    this.config = Tab.config.invoke(this)
    this.setHidden = setHidden

    this.tabId = util.uid()
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
