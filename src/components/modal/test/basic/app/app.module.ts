import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';

import { SomeAppProvider } from '../services/some-app-provider';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      statusbarPadding: true,
      swipeBackEnabled: true
    }),
    PageOneModule
  ],
  bootstrap: [IonicApp],
  providers: [SomeAppProvider],
})
export class AppModule {}

