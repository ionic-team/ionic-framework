import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';
import { ModalPageModule } from '../pages/modal-page/modal-page.module';
import { PageOneModule } from '../pages/page-one/page-one.module';

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp),
    ModalPageModule,
    PageOneModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
