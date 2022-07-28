import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GlobalComponent } from "./global.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: GlobalComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class GlobalRoutingModule { }
