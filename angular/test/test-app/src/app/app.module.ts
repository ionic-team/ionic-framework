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

@NgModule({
  declarations: [
    AppComponent,
    InputsComponent,
    ModalComponent,
    ModalExampleComponent,
    RouterLinkComponent,
    RouterLinkPageComponent,
    HomePageComponent
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
