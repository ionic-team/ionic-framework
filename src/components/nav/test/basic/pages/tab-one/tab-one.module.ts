import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Module { }
