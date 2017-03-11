import { Component } from '@angular/core';
import { App, DeepLink, Tabs } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'tab-one.html'
})
export class TabOne {
  items: any[] = [];

  constructor(private tabs: Tabs, private app: App) {
    for (var i = 1; i <= 250; i++) {
      this.items.push(i);
    }
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}
