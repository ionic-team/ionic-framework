import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { GlobalRoutingModule } from "./global-routing.module";
import { GlobalComponent } from "./global.component";

@NgModule({
  imports: [
    IonicModule,
    GlobalRoutingModule
  ],
  declarations: [GlobalComponent]
})
export class GlobalModule { }
