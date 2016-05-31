import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoApp {

  data = {
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

ionicBootstrap(ApiDemoApp);
