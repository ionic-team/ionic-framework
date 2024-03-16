import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ModalInlineRoutingModule } from "./modal-inline-routing.module";
import { ModalInlineComponent } from "./modal-inline.component";

@NgModule({
  imports: [CommonModule, IonicModule, ModalInlineRoutingModule],
  declarations: [ModalInlineComponent],
  exports: [ModalInlineComponent]
})
export class ModalInlineModule { }
