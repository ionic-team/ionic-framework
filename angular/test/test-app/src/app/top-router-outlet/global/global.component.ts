import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-global',
  templateUrl: 'global.component.html'
})
export class GlobalComponent {

  constructor(private navCtrl: NavController) { }

  goBack() {
    return this.navCtrl.pop();
  }

}
