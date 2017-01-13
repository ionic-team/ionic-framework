import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
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
export class E2EApp {
  rootPage = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
