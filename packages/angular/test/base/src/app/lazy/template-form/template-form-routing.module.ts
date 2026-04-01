import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TemplateFormComponent } from "./template-form.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TemplateFormComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class TemplateFormRoutingModule { }
