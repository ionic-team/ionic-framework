import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PopoverInlineComponent } from "./popover-inline.component";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: PopoverInlineComponent
    }
  ])],
  exports: [RouterModule]
})
export class PopoverInlineRoutingModule { }
