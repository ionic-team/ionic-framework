import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TabsGlobalRoutingModule } from "./tabs-global-routing.module";
import { TabsGlobalComponent } from "./tabs-global.component";

@NgModule({
  imports: [
    IonicModule,
    TabsGlobalRoutingModule
  ],
  declarations: [TabsGlobalComponent]
})
export class TabsGlobalModule { }
