import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';
import { E2EApp } from './app.component';


@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(E2EApp, {}, {
      links: [
        { loadChildren: '../pages/main/main.module#E2EPageModule', name: 'E2EPage' },
        { loadChildren: '../pages/page2/page2.module#Page2Module', name: 'Page2' },
        { loadChildren: '../pages/tabs/tabs.module#TabsPageModule', name: 'TabsPage' }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
