import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../../';

import { AppComponent } from './app.component';
import { ComponentsModule } from '../pages/components/components.module';
import {AssistiveTouchComponentModule} from '../components/assistive-touch/assistive-touch.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {}),
    ComponentsModule,
    AssistiveTouchComponentModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
