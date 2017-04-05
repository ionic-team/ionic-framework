import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { AnotherPage } from './another-page';


@NgModule({
  imports: [
    IonicPageModule.forChild(AnotherPage)
  ],
  declarations: [
    AnotherPage
  ],
  entryComponents: [
    AnotherPage,
  ]
})
export class AnotherPageModule { }
