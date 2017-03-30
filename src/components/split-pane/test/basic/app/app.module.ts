import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';
import { SidePageModule } from '../pages/side-page/side-page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      swipeBackEnabled: true
    }),
    PageOneModule,
    SidePageModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}

