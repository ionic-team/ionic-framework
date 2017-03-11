import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { ModalPageModule } from '../pages/modal-page/modal-page.module';
import { PageOneModule } from '../pages/page-one/page-one.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {}),
    ModalPageModule,
    PageOneModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
