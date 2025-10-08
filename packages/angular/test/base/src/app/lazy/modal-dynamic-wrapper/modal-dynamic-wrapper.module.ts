import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { DynamicComponentWrapperComponent } from "./dynamic-component-wrapper.component";
import { DynamicModalContentComponent } from "./dynamic-modal-content.component";
import { ModalDynamicWrapperRoutingModule } from "./modal-dynamic-wrapper-routing.module";
import { ModalDynamicWrapperComponent } from "./modal-dynamic-wrapper.component";

@NgModule({
  imports: [CommonModule, IonicModule, ModalDynamicWrapperRoutingModule],
  declarations: [ModalDynamicWrapperComponent, DynamicComponentWrapperComponent, DynamicModalContentComponent],
  exports: [ModalDynamicWrapperComponent]
})
export class ModalDynamicWrapperModule { }
