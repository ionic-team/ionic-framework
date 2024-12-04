import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OverlayKeepContentsMountedComponent } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OverlayKeepContentsMountedComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class OverlayKeepContentsMountedComponentRoutingModule { }
