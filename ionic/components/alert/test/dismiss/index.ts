import { Alert, NavController, App, Page } from 'ionic-angular/index';


@Page({
  templateUrl: 'main.html'
})
export class E2EPage {

  constructor(private nav: NavController) {}

	submit() {
    var alert = Alert.create({
      title: 'Not logged in',
      message: 'Sign in to continue.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sign in',
          handler: () => {
            console.log('Sign in');
          }
        }
      ]
    });

    alert.onDismiss((asdf) => {
      console.log('dismiss');
      this.nav.push(AnotherPage);
    });

    this.nav.present(alert);
	}
}

@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Another Page</ion-title>
    </ion-navbar>
    <ion-content padding>
      Welcome!
    </ion-content>
  `
})
class AnotherPage {}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}