import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  groups: any[] = [];

  constructor() {
    var letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

    for (var i = 0; i < letters.length; i++) {
      var group: any[] = [];

      for (var j = 0; j < 10; j++) {
        group.push({
          title: letters[i] + j
        });
      }

      this.groups.push({
        title: letters[i].toUpperCase(),
        items: group
      });
    }
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class E2EApp {
  rootPage = E2EPage;
}

ionicBootstrap(E2EApp);
