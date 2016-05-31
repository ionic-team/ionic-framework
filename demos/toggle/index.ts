import {Component} from '@angular/core';
import {ionicBootstrap} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  data = {
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

ionicBootstrap(ApiDemoApp);
