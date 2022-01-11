import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OverlayNestedPageComponent } from "./overlay-nested-page.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OverlayNestedPageComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class OverlayNestedPageRoutingModule { }
