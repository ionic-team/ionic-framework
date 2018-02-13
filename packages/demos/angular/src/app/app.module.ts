import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PostTestService } from './post-test/post-test.service';

import { IonicAngularModule, IonicRouterModule } from '@ionic/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    IonicAngularModule.forRoot(),
    IonicRouterModule.forRoot()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PostTestService]
})
export class AppModule { }
