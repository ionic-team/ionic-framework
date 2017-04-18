import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IconModule } from '../icon/icon.module';

import { Tab } from './tab';
import { TabButton } from './tab-button';
import { TabHighlight } from './tab-highlight';
import { Tabs } from './tabs';

/** @hidden */
@NgModule({
  imports: [
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TabsModule, providers: []
    };
  }
}
