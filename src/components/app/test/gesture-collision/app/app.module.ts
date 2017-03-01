import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {}, {
      links: [
        { name: 'page-one', loadChildren: '../pages/page-one/page-one.module#PageOneModule'},
        { name: 'page-two', loadChildren: '../pages/page-two/page-two.module#PageTwoModule'},
      ]
    }),
    PageOneModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
  ]
})
export class AppModule {}
