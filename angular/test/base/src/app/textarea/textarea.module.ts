import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { TextareaRoutingModule } from "./textarea-routing.module";
import { TextareaComponent } from "./textarea.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TextareaRoutingModule
  ],
  declarations: [
    TextareaComponent
  ]
})
export class TextareaModule { }
