import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OverlayKeepContentsMountedComponentRoutingModule } from "./keep-contents-mounted-routing.module";
import { OverlayKeepContentsMountedComponent } from "./keep-contents-mounted.component";

@NgModule({
  imports: [CommonModule, IonicModule, OverlayKeepContentsMountedComponentRoutingModule],
  declarations: [OverlayKeepContentsMountedComponent],
  exports: [OverlayKeepContentsMountedComponent]
})
export class OverlayAutoMountModule { }
