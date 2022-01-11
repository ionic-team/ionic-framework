import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OverlayNestedExampleComponent } from "./overlay-nested-example.component";

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [OverlayNestedExampleComponent],
  exports: [OverlayNestedExampleComponent]
})
export class OverlayNestedModule { }
