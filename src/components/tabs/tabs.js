import {NgElement, Component, Template, Parent, For} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'

@Component({
  selector: 'ion-tabs',
  bind: {
    placement: 'placement'
  }
})
@Template({
  inline: `
    <div class="toolbar tab-bar"
         [class.toolbar-top]="placement=='top'"
         [class.toolbar-bottom]="placement=='bottom'">
      <div class="tab-bar-container">
        <a *for="#tab of tabs"
          class="tab-bar-item"
          [class.tab-active]="tab.isSelected"
          (^click)="onClickTabItem($event, tab)">
            <icon class="tab-bar-item-icon ion-home"></icon>
            <span class="tab-bar-item-text">{{tab.title}}</span>
        </a>
      </div>
    </div>
    <content></content>
  `,
  directives: [For]
})
export class Tabs  {
  constructor(
    element: NgElement
  ) {
    this.domElement = element.domElement
    this.domElement.classList.add('pane')
    this.config = Tabs.config.invoke(this)

    this.tabs = []
  }

  addTab(tab) {
    this.tabs.push(tab)
    if (this.tabs.length == 1) {
      this.select(tab)
    }
  }

  onClickTabItem(ev, tab) {
    ev.preventDefault()
    if (this.selectedTab !== tab) {
      this.select(tab)
    } else if (tab._stack.length >= 2) {
      while (tab._stack.length > 2) {
        tab.pop({ sync: true }) // pop with no animation
      }
      tab.pop() //pop last one with animation
    }
  }

  select(tab) {
    this.tabs.forEach(otherTab => {
      otherTab.setSelected(false)
    })
    tab.setSelected(true)
    this.selectedTab = tab
  }

}

new IonicComponent(Tabs, {
  bind: {
    placement: {
      defaults: {
        ios: 'bottom',
        android: 'top',
        base: 'bottom'
      }
    }
  }
})
