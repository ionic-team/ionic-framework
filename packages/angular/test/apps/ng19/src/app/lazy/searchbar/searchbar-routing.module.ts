import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SearchbarComponent } from "./searchbar.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SearchbarComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class SearchbarRoutingModule { }