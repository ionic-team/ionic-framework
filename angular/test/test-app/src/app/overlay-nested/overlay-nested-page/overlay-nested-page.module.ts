import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OverlayNestedPageRoutingModule } from "./overlay-nested-page-routing.module";
import { OverlayNestedPageComponent } from "./overlay-nested-page.component";


@NgModule({
  imports: [OverlayNestedPageRoutingModule, IonicModule],
  declarations: [OverlayNestedPageComponent]
})
export class OverlayNestedPageModule { }
