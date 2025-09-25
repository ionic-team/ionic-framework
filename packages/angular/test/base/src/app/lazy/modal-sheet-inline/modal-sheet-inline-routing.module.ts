import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalSheetInlineComponent } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ModalSheetInlineComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ModalSheetInlineRoutingModule { }
