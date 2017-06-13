import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab1Page2 } from './tab1-page2';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab1Page2)
  ],
  declarations: [
    Tab1Page2
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page2Module { }
