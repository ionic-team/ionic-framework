import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VersionTestComponent } from "./version-test.component";

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
