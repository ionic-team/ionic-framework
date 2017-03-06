import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { SecondPage } from './second-page';
@NgModule({
  imports: [
    DeepLinkModule.forChild(SecondPage)
  ],
  declarations: [
    SecondPage
  ],
  entryComponents: [
    SecondPage
  ]
})
export class SecondPageModule { }
