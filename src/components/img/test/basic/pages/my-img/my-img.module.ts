import { NgModule } from '@angular/core';

import { IonicPageModule } from '../../../../../..';

import { MyImg } from './my-img';

@NgModule({
  declarations: [
    MyImg,
  ],
  exports: [
    MyImg
  ],
  imports: [
    IonicPageModule.forChild(MyImg)
  ]
})
export class MyImgModule {}
