import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VersionTestComponent } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: VersionTestComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class VersionTestRoutingModule { }
