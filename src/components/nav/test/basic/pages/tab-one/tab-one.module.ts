import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab1 } from './tab-one';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab1)
  ],
  declarations: [
    Tab1
  ],
  entryComponents: [
    Tab1,
  ]
})
export class Tab1Module { }
