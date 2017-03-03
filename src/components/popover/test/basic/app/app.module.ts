import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { E2EApp } from './app.component';

@NgModule({
  declarations: [
    E2EApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {}, {
      links: [
        { loadChildren: '../pages/main/main.module#E2EPageModule', name: 'E2EPage' },
        { loadChildren: '../pages/popover-long-list-page/popover-long-list-page.module#PopoverLongListPageModule', name: 'PopoverLongListPage' },
        { loadChildren: '../pages/popover-list-page/popover-list-page.module#PopoverListPageModule', name: 'PopoverListPage' },
        { loadChildren: '../pages/popover-radio-page/popover-radio-page.module#PopoverRadioPageModule', name: 'PopoverRadioPage' },
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
  ]
})
export class AppModule {}
