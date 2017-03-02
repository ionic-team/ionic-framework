import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../src';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';
import { ModalPageModule } from '../pages/modal-page/modal-page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    PageOneModule,
    ModalPageModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
