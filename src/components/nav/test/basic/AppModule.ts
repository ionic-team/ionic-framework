import { NgModule } from '@angular/core';
import { IonicModule } from '../../../../../dist';

import { E2EApp } from './E2EApp.component';
//import { FirstPage } from './FirstPage.component';
//import { AnotherPage } from './AnotherPage.component';
//import { MyCmpTest } from './MyCmpTest.component';
//import { FullPage } from './FullPage.component';
//import { PrimaryHeaderPage } from './PrimaryHeaderPage.component';

@NgModule({
  declarations: [
    E2EApp
//    FirstPage,
//    AnotherPage,
//    MyCmpTest,
//    FullPage,
//    PrimaryHeaderPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  entryComponents: [
    E2EApp
//    FirstPage,
//    AnotherPage,
//    MyCmpTest,
//    FullPage,
//    PrimaryHeaderPage
  ]
})
export class AppModule {}
