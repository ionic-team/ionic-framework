import { APP_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLandingComponent } from './app-landing/app-landing.component';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export function ionicConfigFactory(): any {
  const isLazy = isBrowser && window.location.href.includes('lazy');
  return isLazy ? { keyboardHeight: 12345 } : {};
}

@NgModule({
  declarations: [AppComponent, AppLandingComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(ionicConfigFactory()),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_ID, useValue: 'serverApp' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
