import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab1Page2 } from './tab1-page2';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab1Page2)
  ],
  declarations: [
    Tab1Page2
  ],
  entryComponents: [
    Tab1Page2,
  ]
})
export class Tab1Page2Module { }
