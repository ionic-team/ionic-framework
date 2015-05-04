import {NgElement, Component, View, For, PropertySetter, Query} from 'angular2/angular2';
import {QueryList} from 'angular2/src/core/compiler/query_list';
import {IonicComponent} from 'ionic/config/component';
import {Toolbar} from 'ionic/components/toolbar/toolbar';
import {Tab} from 'ionic/components/tabs/tab';

@Component({
  selector: 'ion-tabs',
  properties: {
    tabBarPlacement: 'tab-bar-placement',
    tabBarIcons: 'tab-bar-icons'
  }
})
@View({
  //[attr.aria-activedescendant]="'tab-item-' + selectedTab.tabId"
  template: `
      <!-- TODO: Once the reprojected toolbar preserves the context of the Tabs, then
           remove this for loop and use the one in the ion-toolbar below. -->
      <button *for="#t of tabs"
        role="tab"
        class="button button-primary"
        [attr.id]="'tab-item-' + t.tabId"
        [attr.aria-controls]="'tab-content-' + t.tabId"
        [attr.aria-selected]="t.isSelected"
        [style.color]="t.isSelected ? 'red' : ''"
        (^click)="onClickTabItem($event, t)">
          <icon [class-name]="'tab-bar-item-icon ' + t.icon" [hidden]="!t.icon"></icon>
          <span class="tab-bar-item-text" [hidden]="!t.title">{{t.title}}</span>
      </button>

    <!-- TODO: set the ion-toolbar being on top or bottom depending upon configuration. -->
    <header *ion-toolbar class="tab-bar">
      The tabbar buttons should be in this bar.
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
    </header>

    <section class="tab-pane-container">
      <content></content>
    </section>
  `,
  directives: [For, Toolbar]
})
export class Tabs {
  constructor(
    @NgElement() ngElement: NgElement
    /*
     TODO once QueryList#onChange is fixed, switch to a queryList of tabs, for the
     sake of simplicity
     @Query(Tab) tabs:QueryList
    */
  ) {
    this.domElement = ngElement.domElement;
    this.config = Tabs.config.invoke(this);

    this.tabs = [];
  }

  addTab(tab) {
    this.tabs.push(tab);
    if (this.tabs.length == 1) {
      this.select(tab);
    }
  }

  onClickTabItem(ev, tab) {
    ev.preventDefault()
    if (this.selectedTab !== tab) {
      this.select(tab);
    } else if (tab.nav._stack.length >= 2) {
      tab.nav.popTo(0);
    }
  }

  select(tab) {
    this.tabs.forEach(otherTab => {
      otherTab.setSelected(false);
    })
    tab.setSelected(true);
    this.selectedTab = tab;
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
