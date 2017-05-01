import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';
import { CustomInnerComponentModule } from '../pages/custom-component/custom-component.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {}),
    PageOneModule,
    CustomInnerComponentModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
