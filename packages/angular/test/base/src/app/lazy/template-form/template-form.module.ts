import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { TemplateFormRoutingModule } from "./template-form-routing.module";
import { TemplateFormComponent } from "./template-form.component";
import { ValidatorsModule } from "../validators/validators.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TemplateFormRoutingModule,
    ValidatorsModule
  ],
  declarations: [
    TemplateFormComponent
  ]
})
export class TemplateFormModule { }
