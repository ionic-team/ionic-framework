import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InputsComponent } from './inputs/inputs.component';
import { ModalComponent } from './modal/modal.component';
import { ModalExampleComponent } from './modal-example/modal-example.component';
import { RouterLinkComponent } from './router-link/router-link.component';
import { RouterLinkPageComponent } from './router-link-page/router-link-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabsTab1Component } from './tabs-tab1/tabs-tab1.component';
import { TabsTab2Component } from './tabs-tab2/tabs-tab2.component';
import { TabsTab1NestedComponent } from './tabs-tab1-nested/tabs-tab1-nested.component';

@NgModule({
  declarations: [
    AppComponent,
    InputsComponent,
    ModalComponent,
    ModalExampleComponent,
    RouterLinkComponent,
    RouterLinkPageComponent,
    HomePageComponent,
    TabsComponent,
    TabsTab1Component,
    TabsTab2Component,
    TabsTab1NestedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  entryComponents: [
    ModalExampleComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
