import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab2Page2 } from './tab2-page2';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab2Page2)
  ],
  declarations: [
    Tab2Page2
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page2Module { }
