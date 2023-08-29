import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, logoIonic, save } from 'ionicons/icons';

addIcons({ add, logoIonic, save });

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs]
})
export class TabsComponent {
  // tabsDidChangeCounter = 0;
  // tabsDidChangeEvent = '';
  // tabsDidChangeSelectedTab? = '';

  // tabsWillChangeCounter = 0;
  // tabsWillChangeEvent = '';
  // tabsWillChangeSelectedTab? = '';

  @ViewChild(IonTabBar) tabBar!: IonTabBar;

  // tabChanged(ev: { tab: string }) {
  //   console.log('ionTabsDidChange', this.tabBar.selectedTab);
  //   this.tabsDidChangeCounter++;
  //   this.tabsDidChangeEvent = ev.tab;
  //   this.tabsDidChangeSelectedTab = this.tabBar.selectedTab;
  // }

  // tabsWillChange(ev: { tab: string }) {
  //   console.log('ionTabsWillChange', this.tabBar.selectedTab);
  //   this.tabsWillChangeCounter++;
  //   this.tabsWillChangeEvent = ev.tab;
  //   this.tabsWillChangeSelectedTab = this.tabBar.selectedTab;
  // }
}
