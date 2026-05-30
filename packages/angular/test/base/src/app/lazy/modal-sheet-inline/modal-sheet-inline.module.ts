import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ModalSheetInlineRoutingModule } from "./modal-sheet-inline-routing.module";
import { ModalSheetInlineComponent } from "./modal-sheet-inline.component";

@NgModule({
  imports: [CommonModule, IonicModule, ModalSheetInlineRoutingModule],
  declarations: [ModalSheetInlineComponent],
  exports: [ModalSheetInlineComponent]
})
export class ModalSheetInlineModule { }
