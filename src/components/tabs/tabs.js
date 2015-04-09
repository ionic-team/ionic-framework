import {NgElement, Component, Template, Parent, For} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'

@Component({
  selector: 'ion-tabs',
  bind: {
    placement: 'placement',
    tabBarIcons: 'tab-bar-icons',
    tabBarText: 'tab-bar-text'
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
            <icon class="tab-bar-item-icon ion-home" [hidden]="tabBarIcons=='none'"></icon>
            <span class="tab-bar-item-text" [hidden]="tabBarText=='none'">{{tab.title}}</span>
        </a>
      </div>
    </div>
    <div class="pane-container tabs-container">
      <content></content>
    </div>
  `,
  directives: [For]
})
export class Tabs  {
  constructor(
    @NgElement() ngElement: NgElement
  ) {
    this.domElement = ngElement.domElement
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
      tab.popTo(0)
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
    },
    tabBarIcons: {
      defaults: {
        ios: 'top',
        android: 'none',
        base: 'top'
      }
    },
    tabBarText: {}
  }
})
