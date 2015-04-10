import {NgElement, Component, Template, For} from 'angular2/angular2'
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
    <header class="toolbar-container">
      <!-- COLLECTION OF TOOLBARS FOR EACH OF ITS VIEWS WITHIN THIS NAV-VIEWPORT -->
      <!-- TOOLBARS FOR EACH VIEW SHOULD HAVE THE SAME CONTEXT AS ITS VIEW -->
    </header>

    <nav class="tab-bar">
      <div class="tab-bar-container">
        <a *for="#tab of tabs"
          class="tab-bar-item"
          [class.tab-active]="tab.isSelected"
          (^click)="onClickTabItem($event, tab)">
            <icon class="tab-bar-item-icon ion-home"
              [hidden]="tabBarIcons=='none'"
              [class.tab-bar-icon-bottom]="tabBarIcons=='bottom'"
              [class.tab-bar-icon-top]="tabBarIcons=='top'"></icon>
            <span class="tab-bar-item-text" [hidden]="tabBarText=='none'">{{tab.title}}</span>
        </a>
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

    // should be used to cover up sibling .nav-pane's and it's parent
    this.domElement.classList.add('nav-pane-cover-parent')

    // .tab-bar-top/bottom should be added to the entire element when specified

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
