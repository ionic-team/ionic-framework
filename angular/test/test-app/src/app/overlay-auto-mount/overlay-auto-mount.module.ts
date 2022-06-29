import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OverlayAutoMountRoutingModule } from "./overlay-auto-mount-routing.module";
import { OverlaykeepContentsMounted } from "./overlay-auto-mount.component";

@NgModule({
  imports: [CommonModule, IonicModule, OverlayAutoMountRoutingModule],
  declarations: [OverlaykeepContentsMounted],
  exports: [OverlaykeepContentsMounted]
})
export class OverlayAutoMountModule { }
