import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { TabsPageModule } from '../pages/tabs-page/tabs-page.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      tabsHighlight: true,
    }),
    TabsPageModule
  ],
  bootstrap: [IonicApp],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
