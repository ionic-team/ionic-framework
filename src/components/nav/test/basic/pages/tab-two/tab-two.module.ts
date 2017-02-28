import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab2 } from './tab-two';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab2)
  ],
  declarations: [
    Tab2
  ],
  entryComponents: [
    Tab2,
  ]
})
export class Tab2Module { }
