import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Tab2Page2 } from './tab2-page2';


@NgModule({
  imports: [
    DeepLinkModule.forChild(Tab2Page2)
  ],
  declarations: [
    Tab2Page2
  ],
  entryComponents: [
    Tab2Page2,
  ]
})
export class Tab2Page2Module { }
