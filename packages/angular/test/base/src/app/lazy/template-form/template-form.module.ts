import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { TemplateFormRoutingModule } from "./template-form-routing.module";
import { TemplateFormComponent } from "./template-form.component";
import { RequireTrueValidatorDirective } from "../validators/require-true.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TemplateFormRoutingModule,
    RequireTrueValidatorDirective
  ],
  declarations: [
    TemplateFormComponent
  ]
})
export class TemplateFormModule { }
