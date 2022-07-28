import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { Tab1Child1Component } from "./tab1-child1/tab1-child1.component";
import { Tab1Child2Component } from "./tab1-child2/tab1-child2.component";
import { Tab1RoutingModule } from "./tab1-routing.module";

@NgModule({
  imports: [
    IonicModule,
    Tab1RoutingModule
  ],
  declarations: [
    Tab1Child1Component,
    Tab1Child2Component
  ]
})
export class Tab1Module { }
