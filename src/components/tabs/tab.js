import {
  NgElement, 
  Component, 
  Template, 
  Ancestor, 
  PropertySetter, 
  For
} from 'angular2/angular2';
import {NavViewport, NavView, Tabs} from 'ionic2/components'
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
  <section class="nav-view" *for="#item of getRawNavStack()" [item]="item">
  </section>
  `,
  directives: [For, NavView]
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

new IonicComponent(Tab, {
})
