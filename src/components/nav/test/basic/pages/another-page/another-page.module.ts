import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { AnotherPage } from './another-page';


@NgModule({
  imports: [
    DeepLinkModule.forChild(AnotherPage)
  ],
  declarations: [
    AnotherPage
  ],
  entryComponents: [
    AnotherPage,
  ]
})
export class AnotherPageModule { }
