import { Component, ViewChild } from '@angular/core';
import { IonTabBar } from '@ionic/angular';

@Component({
  selector: 'app-tabs-basic',
  templateUrl: './tabs-basic.component.html',
  styleUrls: ['./tabs-basic.component.css'],
  standalone: false
})
export class TabsBasicComponent {
  constructor() { }

  tabsWillChangeCounter = 0;
  tabsWillChangeEvent = '';
  tabsWillChangeSelectedTab? = '';

  tabsDidChangeCounter = 0;
  tabsDidChangeEvent = '';
  tabsDidChangeSelectedTab? = '';

  @ViewChild(IonTabBar) tabBar!: IonTabBar;

  onTabWillChange(ev: { tab: string }) {
    console.log('ionTabsWillChange', this.tabBar.selectedTab);
    this.tabsWillChangeCounter++;
    this.tabsWillChangeEvent = ev.tab;
    this.tabsWillChangeSelectedTab = this.tabBar.selectedTab;
  }

  onTabDidChange(ev: { tab: string }) {
    console.log('ionTabsDidChange', this.tabBar.selectedTab);
    this.tabsDidChangeCounter++;
    this.tabsDidChangeEvent = ev.tab;
    this.tabsDidChangeSelectedTab = this.tabBar.selectedTab;
  }
}
