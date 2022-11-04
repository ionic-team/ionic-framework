import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { OutputTargetRoutingModule } from "./output-target-routing.module";
import { OutputTargetComponent } from "./output-target.component";

@NgModule({
  imports: [IonicModule, OutputTargetRoutingModule],
  declarations: [OutputTargetComponent]
})
export class OutputTargetModule { }
