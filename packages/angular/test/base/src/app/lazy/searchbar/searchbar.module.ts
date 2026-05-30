import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SearchbarRoutingModule } from "./searchbar-routing.module";
import { SearchbarComponent } from "./searchbar.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchbarRoutingModule
  ],
  declarations: [
    SearchbarComponent
  ]
})
export class SearchbarModule { }