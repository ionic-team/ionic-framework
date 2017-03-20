import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { PageOneModule } from '../pages/page-one/page-one.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    IonicModule.forRoot(AppComponent, {
      swipeBackEnabled: true
    }),
    PageOneModule
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}

