import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicAngularModule } from '@ionic/angular';

import { IonicRouterOutlet } from './ionic-router-outlet';
import { RouterIntegration } from './router-integration';

@NgModule({
  declarations: [
    AppComponent,
    IonicRouterOutlet
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    IonicAngularModule.forRoot()
  ],
  providers: [
    RouterIntegration
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
