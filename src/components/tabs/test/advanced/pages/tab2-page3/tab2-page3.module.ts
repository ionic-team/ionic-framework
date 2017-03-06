import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab2Page3 } from './tab2-page3';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab2Page3)
  ],
  declarations: [
    Tab2Page3
  ],
  entryComponents: [
    Tab2Page3,
  ]
})
export class Tab2Page3Module { }
