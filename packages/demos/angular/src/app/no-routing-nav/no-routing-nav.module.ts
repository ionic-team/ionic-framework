import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoRoutingNavPageComponent } from './no-routing-nav.component';
import { NoRoutingNavRoutingModule } from './no-routing-nav-routing.module';
import { IonicAngularModule, IonicRouterModule} from '@ionic/angular';

import { PageOne } from './pages/page-one';
import { PageTwo } from './pages/page-two';
import { PageThree } from './pages/page-three';

@NgModule({
  imports: [
    CommonModule,
    NoRoutingNavRoutingModule,
    IonicAngularModule,
    IonicRouterModule
  ],
  declarations: [
    NoRoutingNavPageComponent,
    PageOne,
    PageTwo,
    PageThree
  ],
  entryComponents: [
    PageOne,
    PageTwo,
    PageThree
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NoRoutingNavModule { }
