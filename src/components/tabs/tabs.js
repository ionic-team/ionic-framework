import {NgElement, Component, Template, For, PropertySetter} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'

@Component({
  selector: 'ion-tabs',
  bind: {
    tabBarPlacement: 'tab-bar-placement',
    tabBarIcons: 'tab-bar-icons',
    tabBarText: 'tab-bar-text'
  }
})
@Template({
  inline: `
    <header class="toolbar-container">
      <!-- COLLECTION OF TOOLBARS FOR EACH VIEW WITHIN EACH TAB-VIEWPORT -->
      <!-- TOOLBARS FOR EACH VIEW SHOULD HAVE THE SAME CONTEXT AS ITS VIEW -->
    </header>

    <nav class="tab-bar-container"
         role="tablist"
         [attr.aria-activedescendant]="'tab-item-' + selectedTab.tabId">
      <div class="tab-bar">
        <button *for="#tab of tabs"
          role="tab"
          class="tab-bar-item"
          [attr.id]="'tab-item-' + tab.tabId"
          [attr.aria-controls]="'tab-content-' + tab.tabId"
          [attr.aria-selected]="tab.isSelected"
          (^click)="onClickTabItem($event, tab)">
            <icon class="tab-bar-item-icon ion-home"
              [hidden]="tabBarIcons=='none'"
              [class.tab-bar-icon-bottom]="tabBarIcons=='bottom'"
              [class.tab-bar-icon-top]="tabBarIcons=='top'"></icon>
            <span class="tab-bar-item-text" [hidden]="tabBarText=='none'">{{tab.title}}</span>
        </button>
      </div>
    </nav>

    <section class="tab-pane-container">
      <content></content>
    </section>
  `,
  directives: [For]
})
export class Tabs  {
  constructor(
    @NgElement() ngElement: NgElement
  ) {
    this.domElement = ngElement.domElement

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
    'tab-bar-placement': {
      defaults: {
        ios: 'bottom',
        android: 'top',
        core: 'bottom'
      }
    },
    'tab-bar-icons': {
      defaults: {
        ios: 'top',
        android: 'none',
        core: 'top'
      }
    },
    tabBarText: {}
  }
})
