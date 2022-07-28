import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";

@NgModule({
  imports: [
    IonicModule,
    TabsRoutingModule
  ],
  declarations: [
    TabsComponent
  ]
})
export class TabsModule { }
