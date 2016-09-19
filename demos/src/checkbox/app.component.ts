import { Component } from '@angular/core';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {

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
    catelyn: true,
    bronn: false
  };

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
