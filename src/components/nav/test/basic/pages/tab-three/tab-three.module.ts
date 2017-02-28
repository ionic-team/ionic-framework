import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab3 } from './tab-three';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab3)
  ],
  declarations: [
    Tab3
  ],
  entryComponents: [
    Tab3,
  ]
})
export class Tab3Module { }
