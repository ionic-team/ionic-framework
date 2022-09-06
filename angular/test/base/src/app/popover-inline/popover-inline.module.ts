import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { PopoverInlineRoutingModule } from "./popover-inline-routing.module";
import { PopoverInlineComponent } from "./popover-inline.component";

@NgModule({
  imports: [CommonModule, IonicModule, PopoverInlineRoutingModule],
  declarations: [PopoverInlineComponent],
})
export class PopoverInlineModule { }
