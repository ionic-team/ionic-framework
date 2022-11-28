import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabBar } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
  tabsDidChangeCounter = 0;
  tabsDidChangeEvent = '';
  tabsDidChangeSelectedTab? = '';

  tabsWillChangeCounter = 0;
  tabsWillChangeEvent = '';
  tabsWillChangeSelectedTab? = '';

  @ViewChild(IonTabBar) tabBar!: IonTabBar;

  tabChanged(ev: { tab: string }) {
    console.log('ionTabsDidChange', this.tabBar.selectedTab);
    this.tabsDidChangeCounter++;
    this.tabsDidChangeEvent = ev.tab;
    this.tabsDidChangeSelectedTab = this.tabBar.selectedTab;
  }

  tabsWillChange(ev: { tab: string }) {
    console.log('ionTabsWillChange', this.tabBar.selectedTab);
    this.tabsWillChangeCounter++;
    this.tabsWillChangeEvent = ev.tab;
    this.tabsWillChangeSelectedTab = this.tabBar.selectedTab;
  }
}
