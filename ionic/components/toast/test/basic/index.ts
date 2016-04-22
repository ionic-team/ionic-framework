import {App, Page, Toast, NavController} from 'ionic-angular';

@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Another Page</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p>This is another page to show that the toast stays.</p>
    </ion-content>
  `
})
class AnotherPage {

}

@Page({
  templateUrl: 'main.html'
})
class E2EPage {

  constructor(private nav: NavController) { }

  showToast() {
    const toast = Toast.create({
      message: 'User was created successfully',
      showCloseButton: true,
      enableBackdropDismiss: false
    });

    toast.onDismiss(() => {
      console.log('Dismissed toast');
    });

    this.nav.present(toast);

    setTimeout(() => {
      this.nav.push(AnotherPage);
    }, 1000);
  }

  showLongToast() {
    const toast = Toast.create({
      message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.',
    });

    toast.onDismiss(this.dismissHandler);
    this.nav.present(toast);
  }

  showDismissDurationToast() {
    const toast = Toast.create({
      message: 'I am dismissed after 1.5 seconds',
      duration: 1500
    });
    toast.onDismiss(this.dismissHandler);
    this.nav.present(toast);
  }

  showToastWithCloseButton() {
    const toast = Toast.create({
      message: 'Your internet connection appears to be offline. Data integrity is not gauranteed.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.onDismiss(this.dismissHandler);
    this.nav.present(toast);
  }

  private dismissHandler(toast: Toast) {
    console.info('Toast onDismiss()');

  }

}

@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
  constructor() {
  }
}
