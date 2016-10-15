import { Component } from '@angular/core';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
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


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
