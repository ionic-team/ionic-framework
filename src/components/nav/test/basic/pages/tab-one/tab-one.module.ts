import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab1 } from './tab-one';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab1)
  ],
  declarations: [
    Tab1
  ],
  entryComponents: [
    Tab1,
  ]
})
export class Tab1Module { }
