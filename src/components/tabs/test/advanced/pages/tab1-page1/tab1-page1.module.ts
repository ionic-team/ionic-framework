
import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab1Page1 } from './tab1-page1';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab1Page1)
  ],
  declarations: [
    Tab1Page1
  ],
  entryComponents: [
    Tab1Page1,
  ]
})
export class Tab1Page1Module { }
