import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OverlayKeepContentsMounted } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OverlayKeepContentsMounted
      }
    ])
  ],
  exports: [RouterModule]
})
export class OverlayKeepContentsMountedRoutingModule { }
