import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RequireTrueValidatorDirective } from "./require-true.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    RequireTrueValidatorDirective
  ],
  exports: [
    RequireTrueValidatorDirective
  ]
})
export class ValidatorsModule { }
