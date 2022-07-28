import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-tab1-child2',
  templateUrl: 'tab1-child2.component.html',
})
export class Tab1Child2Component {

  constructor(private navCtrl: NavController) { }

  goBack() {
    return this.navCtrl.pop();
  }
}
