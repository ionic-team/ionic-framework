import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'standalone',
        loadComponent: () => import('./standalone/standalone.component').then(m => m.StandaloneComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class VersionTestRoutingModule { }
