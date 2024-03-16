import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { IonicServerModule } from '@ionic/angular-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    IonicServerModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
