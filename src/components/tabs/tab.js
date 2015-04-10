import {
  NgElement,
  Component,
  Template,
  Ancestor,
  PropertySetter,
  For
} from 'angular2/angular2';
import {NavViewport} from 'ionic2/components/nav-viewport/nav-viewport'
import {NavPane} from 'ionic2/components/nav-pane/nav-pane'
import {Tabs} from 'ionic2/components/tabs/tabs'
import {IonicComponent} from 'ionic2/config/component'


@Component({
  selector: 'ion-tab',
  bind: {
    title: 'tab-title',
    initial: 'initial'
  }
})
@Template({
  inline: `

  <header class="toolbar-container">
    <!-- COLLECTION OF TOOLBARS FOR EACH OF ITS VIEWS WITHIN THIS NAV-VIEWPORT -->
    <!-- TOOLBARS FOR EACH VIEW SHOULD HAVE THE SAME CONTEXT AS ITS VIEW -->
  </header>

  <nav class="nav-tab-bar">
    <!-- SHARED TAB BAR FOR EACH TAB CONTAINER -->

  </nav>

  <div class="nav-pane-container">
    <!-- COLLECTION OF PANES WITHIN THIS NAV-VIEWPORT, EACH PANE AS ONE VIEW -->
    <!-- EACH VIEW HAS A TOOLBAR WHICH NEEDS TO HAVE THE SAME CONTEXT -->
    <section class="nav-pane" *for="#item of getRawNavStack()" [item]="item"></section>
  </div>

  `,
  directives: [For, NavPane]
})
export class Tab extends NavViewport {
  constructor(
    element: NgElement,
    @Ancestor() tabs: Tabs,
    @PropertySetter('class.hide') setHidden: Function
  ) {
    super(element)
    this.config = Tab.config.invoke(this)
    this.setHidden = setHidden

    this.setSelected(false)
    tabs.addTab(this)
  }

  setSelected(isSelected) {
    this.isSelected = !!isSelected
    this.setHidden(!this.isSelected)
  }
}

new IonicComponent(Tab, {})
