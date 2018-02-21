import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule, IonicRouterModule } from '@ionic/angular';

import { AboutPage } from './about';
import { PopoverPage } from './about-popover';
import { AboutPageRoutingModule } from './about-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule.forRoot(),
    IonicRouterModule,
    AboutPageRoutingModule
  ],
  declarations: [
    AboutPage,
    PopoverPage
  ],
  entryComponents: [
    PopoverPage
  ],
  bootstrap: [
    AboutPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AboutModule { }
