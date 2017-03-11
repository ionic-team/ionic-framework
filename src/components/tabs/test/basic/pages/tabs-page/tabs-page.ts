import { Component } from '@angular/core';
import { Config, DeepLink, Tab } from '../../../../../..';

import { TabOne } from '../tab-one/tab-one';

@DeepLink()
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  root1 = TabOne;
  root2 = 'TabTwo';
  root3 = 'TabThree';
  myColor: string;

  constructor(config: Config) {
    this.myColor = (config.get('mode') !== 'ios') ? 'primary' : null;
  }

  onChange(ev: Tab) {
    console.log('Changed tab', ev);
  }

  onSelect(ev: Tab) {
    console.log('Selected tab', ev);
  }
}
