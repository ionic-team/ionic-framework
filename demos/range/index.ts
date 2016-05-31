import {App} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  brightness: number = 20;
  saturation: number = 0;
  warmth: number = 1300;
  structure: any = {lower: 33, upper: 60};

  onChange(ev) {
    console.log("Changed", ev);
  }
}
