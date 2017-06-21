import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab2 } from './tab-two';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab2)
  ],
  declarations: [
    Tab2
  ],
  entryComponents: [
    Tab2,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Module { }
