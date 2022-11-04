import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { OutputTargetComponent } from "./output-target.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: OutputTargetComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class OutputTargetRoutingModule { }
