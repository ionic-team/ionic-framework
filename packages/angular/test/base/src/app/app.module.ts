import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

const isLazy = window.location.href.includes('lazy');

const imports = [
  BrowserModule.withServerTransition({ appId: 'serverApp' }),
  AppRoutingModule,
];

if (isLazy) {
  imports.push(IonicModule.forRoot({ keyboardHeight: 12345 }));
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports,
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
