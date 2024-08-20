import { Component, ViewChild } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs, IonTab } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, logoIonic, save } from 'ionicons/icons';

addIcons({ add, logoIonic, save });

@Component({
  selector: 'app-tabs-basic',
  templateUrl: './tabs-basic.component.html',
  styleUrls: ['./tabs-basic.component.css'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel, IonTabs, IonTab]
})
export class TabsBasicComponent {
  tabsDidChangeCounter = 0;
  tabsDidChangeEvent = '';
  tabsDidChangeSelectedTab? = '';

  tabsWillChangeCounter = 0;
  tabsWillChangeEvent = '';
  tabsWillChangeSelectedTab? = '';

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
