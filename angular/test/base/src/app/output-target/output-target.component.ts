import { Component } from "@angular/core";

@Component({
  selector: "app-output-target",
  templateUrl: "./output-target.component.html",
})
export class OutputTargetComponent {

  ionChangeEmittedCount = 0;

  onIonChange() {
    this.ionChangeEmittedCount++;
  }

}
