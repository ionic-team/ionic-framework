import {NgElement, Component, View as NgView, For, PropertySetter} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'

@Component({
  selector: 'ion-tabs',
  properties: {
    tabBarPlacement: 'tab-bar-placement',
    tabBarIcons: 'tab-bar-icons'
  }
})
@NgView({
  template: `
    <header class="toolbar-container">
      <!-- COLLECTION OF TOOLBARS FOR EACH VIEW WITHIN EACH TAB-VIEWPORT -->
      <!-- TOOLBARS FOR EACH VIEW SHOULD HAVE THE SAME CONTEXT AS ITS VIEW -->
    </header>

    <nav class="tab-bar-container" role="tablist"
         [attr.aria-activedescendant]="'tab-item-' + selectedTab.tabId">
      <div class="tab-bar">
        <button *for="#t of tabs"
          role="tab"
          class="tab-bar-item"
          [attr.id]="'tab-item-' + t.tabId"
          [attr.aria-controls]="'tab-content-' + t.tabId"
          [attr.aria-selected]="t.isSelected"
          (^click)="onClickTabItem($event, t)">
            <icon [class-name]="'tab-bar-item-icon ' + t.icon" [hidden]="!t.icon"></icon>
            <span class="tab-bar-item-text" [hidden]="!t.title">{{t.title}}</span>
        </button>
      </div>
    </nav>

    <section class="tab-pane-container">
      <content></content>
    </section>
  `,
  directives: [For]
})
export class Tabs {
  constructor(
    @NgElement() ngElement: NgElement
  ) {
    console.log("Tabs");
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
  properties: {
    tabBarPlacement: {
      defaults: {
        ios: 'bottom',
        android: 'top',
        core: 'bottom'
      }
    },
    tabBarIcons: {
      defaults: {
        ios: 'top',
        android: 'top',
        core: 'top'
      }
    }
  }
})
