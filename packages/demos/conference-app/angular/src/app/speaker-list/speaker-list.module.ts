import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule, IonicRouterModule} from '@ionic/angular';

import { SpeakerListPage } from './speaker-list';
import { SpeakerListPageRoutingModule } from './speaker-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule,
    IonicRouterModule,
    SpeakerListPageRoutingModule
  ],
  declarations: [
    SpeakerListPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SpeakerListModule { }
