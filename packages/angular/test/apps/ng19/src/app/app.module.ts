import { APP_ID, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

export function ionicConfigFactory(platformId: Object): any {
  // Custom keyboard height for lazy loaded app
  if (isPlatformBrowser(platformId)) {
    const isLazy = window.location.href.includes('lazy');
    return isLazy ? { keyboardHeight: 12345 } : {};
  }
  // Default configuration for non-browser environments
  return {};
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(ionicConfigFactory(PLATFORM_ID)),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_ID, useValue: 'serverApp' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
