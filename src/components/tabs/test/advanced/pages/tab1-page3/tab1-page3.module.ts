import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab1Page3 } from './tab1-page3';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab1Page3)
  ],
  declarations: [
    Tab1Page3
  ],
  entryComponents: [
    Tab1Page3,
  ]
})
export class Tab1Page3Module { }
