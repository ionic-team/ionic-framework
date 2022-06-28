import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OverlayAutoMountRoutingModule } from "./overlay-auto-mount-routing.module";
import { OverlayAutoMountComponent } from "./overlay-auto-mount.component";

@NgModule({
  imports: [CommonModule, IonicModule, OverlayAutoMountRoutingModule],
  declarations: [OverlayAutoMountComponent],
  exports: [OverlayAutoMountComponent]
})
export class OverlayAutoMountModule { }
