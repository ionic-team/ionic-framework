import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";

/**
 * This component is used in conjunction with a tabs router-outlet,
 * to validate the behavior of different routing APIs (e.g. NavController)
 * when leaving and re-entering a router-outlet.
 */
@Component({
  selector: 'app-tabs-global',
  templateUrl: 'tabs-global.component.html'
})
export class TabsGlobalComponent {

  constructor(public navCtrl: NavController) { }

}
