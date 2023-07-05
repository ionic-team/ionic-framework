import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { VersionTestRoutingModule } from "./version-test-routing.module";
import { VersionTestComponent } from "./version-test.component";

@NgModule({
  imports: [CommonModule, IonicModule, VersionTestRoutingModule],
  declarations: [VersionTestComponent],
  exports: [VersionTestComponent]
})
export class VersionTestModule { }
