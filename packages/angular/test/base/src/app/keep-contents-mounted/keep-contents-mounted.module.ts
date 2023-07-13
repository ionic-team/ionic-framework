import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OverlayKeepContentsMountedRoutingModule } from "./keep-contents-mounted-routing.module";
import { OverlayKeepContentsMounted } from "./keep-contents-mounted.component";

@NgModule({
  imports: [CommonModule, IonicModule, OverlayKeepContentsMountedRoutingModule],
  declarations: [OverlayKeepContentsMounted],
  exports: [OverlayKeepContentsMounted]
})
export class OverlayAutoMountModule { }
