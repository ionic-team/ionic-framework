import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule } from '@ionic/angular';

import { TutorialPage } from './tutorial';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule,
  ],
  declarations: [
    TutorialPage,
  ],
  entryComponents: [
    TutorialPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TutorialModule { }
