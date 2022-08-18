import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalInlineComponent } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ModalInlineComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ModalInlineRoutingModule { }
