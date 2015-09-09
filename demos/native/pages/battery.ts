import {IonicView} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button aside-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Battery</ion-title>
  </ion-navbar>
  <ion-content class="padding">
    <h2>Battery</h2>
    <button primary outline (click)="doBatteryStatus()">Get Status</button>
    <div *ng-if="battery">
      Battery charging: <b>{{battery.charging}}</b><br>
      Battery level: <b>{{battery.level * 100}}</b>%<br>
      Battery charging time: <b>{{battery.chargingTime}}</b>s<br>
      Battery discharging time: <b>{{battery.dischargingTime}}</b>s<br>
    </div>

  </ion-content>
  `
})
export class BatteryPage {
  doBatteryStatus() {
    Battery.getStatus().then((battery) => {
      this.battery = battery;
    });
  }
}
