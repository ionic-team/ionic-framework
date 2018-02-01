import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicAngularModule } from '@ionic/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    IonicAngularModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
