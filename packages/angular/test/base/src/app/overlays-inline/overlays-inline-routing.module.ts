import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OverlaysInlineComponent } from "./overlays-inline.component";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: OverlaysInlineComponent
    }
  ])],
  exports: [RouterModule]
})
export class OverlaysInlineRoutingModule { }
