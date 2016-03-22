import {App, Page, Toast, NavController, Platform} from 'ionic-angular';

@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(
    private nav: NavController,
    private platform: Platform)
  {}

  showToast() {
    const toast = Toast.create({
      message: 'User was created successfully',
    });

    this.nav.present(toast);
  }

  showLongToast() {
    const toast = Toast.create({
      message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.',
    });

    this.nav.present(toast);
  }

  showDismissDurationToast() {
     const toast = Toast.create({
       message: 'I am dismissed after 1.5 seconds',
       duration: 1500
     });

     this.nav.present(toast);
  }

  showToastWithCloseButton() {
    const toast = Toast.create({
      message: 'Your internet connection appears to be offline. Data integrity is not gauranteed.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });

    this.nav.present(toast);
  }

}

@Page({
  template: `
    <ion-toolbar>
      <ion-buttons start>
        <button (click)="dismiss()">Close</button>
      </ion-buttons>
      <ion-title>Toast</ion-title>
    </ion-toolbar>
    <ion-content padding>
      Hi, I'm Bob, and I'm a modal.
    </ion-content>
  `
})
class ToastPage {
  constructor(private viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  constructor() {
    this.root = E2EPage;
  }
}
