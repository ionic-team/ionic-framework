import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OverlayAutoMountComponent } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OverlayAutoMountComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class OverlayAutoMountRoutingModule { }
