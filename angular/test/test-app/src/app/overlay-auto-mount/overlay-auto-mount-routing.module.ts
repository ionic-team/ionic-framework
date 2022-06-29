import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OverlaykeepContentsMounted } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OverlaykeepContentsMounted
      }
    ])
  ],
  exports: [RouterModule]
})
export class OverlayAutoMountRoutingModule { }
