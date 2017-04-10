import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { BadgeModule } from '../badge/badge.module';
import { IconModule } from '../icon/icon.module';

import { Tab } from './tab';
import { TabButton } from './tab-button';
import { TabHighlight } from './tab-highlight';
import { Tabs } from './tabs';

/** @hidden */
@NgModule({
  imports: [
    BadgeModule,
    CommonModule,
    IconModule
  ],
  declarations: [
    Tab,
    TabButton,
    TabHighlight,
    Tabs
  ],
  exports: [
    Tab,
    TabButton,
    TabHighlight,
    Tabs
  ]
})
export class TabsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TabsModule, providers: []
    };
  }
}
