import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TextareaComponent } from "./textarea.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TextareaComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class TextareaRoutingModule { }
