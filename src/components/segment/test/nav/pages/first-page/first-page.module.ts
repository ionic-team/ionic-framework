import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { FirstPage } from './first-page';

@NgModule({
  imports: [
    DeepLinkModule.forChild(FirstPage)
  ],
  declarations: [
    FirstPage
  ]
})
export class FirstPageModule { }
