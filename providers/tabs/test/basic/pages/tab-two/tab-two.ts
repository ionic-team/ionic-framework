import { Component } from '@angular/core';
import { App, IonicPage, Tabs } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'tab-two.html'
})
export class TabTwo {
  sessions: any[] = [];

  constructor(private tabs: Tabs, private app: App) {
    for (var i = 1; i <= 250; i++) {
      this.sessions.push({
        name: 'Name ' + i,
        location: 'Location: ' + i
      });
    }
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}
