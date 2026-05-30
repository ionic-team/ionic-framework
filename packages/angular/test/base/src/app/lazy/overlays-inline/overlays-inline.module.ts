import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OverlaysInlineRoutingModule } from "./overlays-inline-routing.module";
import { OverlaysInlineComponent } from "./overlays-inline.component";

@NgModule({
  imports: [CommonModule, IonicModule, OverlaysInlineRoutingModule],
  declarations: [OverlaysInlineComponent],
})
export class OverlaysInlineModule { }
