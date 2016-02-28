import {App} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  data;

  constructor() {
    this.data = {
      jon: true,
      daenerys: true,
      arya: false,
      tyroin: false,
      sansa: true,
      khal: false,
      cersei: true,
      stannis: true,
      petyr: false,
      hodor: true,
      catelyn: true
    };
  }

}
