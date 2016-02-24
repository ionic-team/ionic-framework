import {App} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  data;

  constructor() {
    this.data = {
      frodo: true,
      sam: false,
      eowyn: true,
      legolas: true,
      gimli: false,
      saruman: true,
      gandalf: true,
      arwen: false,
      boromir: false,
      gollum: true,
      galadriel: false
    };
  }

}
