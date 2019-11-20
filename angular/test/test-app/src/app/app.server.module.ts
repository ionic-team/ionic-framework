import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { IonicServerModule } from '@ionic/angular-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    IonicServerModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
