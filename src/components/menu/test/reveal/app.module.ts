import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Nav } from '../../../..';


@Component({templateUrl: 'page1.html'})
export class Page1 {}


@Component({
  templateUrl: 'main.html'
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  rootView = Page1;

  openPage(menu: any, page: any) {
    // close the menu when clicking a link from the menu
    menu.close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    Page1
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    Page1
  ]
})
export class AppModule {}
