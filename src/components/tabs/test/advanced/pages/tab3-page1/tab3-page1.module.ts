
import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab3Page1 } from './tab3-page1';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab3Page1)
  ],
  declarations: [
    Tab3Page1
  ],
  entryComponents: [
    Tab3Page1,
  ]
})
export class Tab3Page1Module { }
