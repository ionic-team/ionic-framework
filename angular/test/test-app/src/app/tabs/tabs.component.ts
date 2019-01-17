import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  tabCounter = 0;
  tabEvent = '';

  tabChanged(ev: {tab: string}) {
    this.tabCounter++;
    this.tabEvent = ev.tab;
  }
}
