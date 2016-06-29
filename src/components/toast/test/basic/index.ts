import { Component } from '@angular/core';
import { ionicBootstrap, Toast, ToastController, NavController } from '../../../../../src';


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Another Page</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <p>This is another page to show that the toast stays.</p>
    </ion-content>
  `
})
class AnotherPage {}


@Component({
  templateUrl: 'main.html'
})
class E2EPage {

  constructor(private toastCtrl: ToastController, private nav: NavController) { }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'User was created successfully'
    });

    toast.onDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

    setTimeout(() => {
      this.nav.push(AnotherPage);
    }, 1000);

    setTimeout(() => {
      toast.dismiss();
    }, 2000);
  }

  showLongToast() {
    const toast = this.toastCtrl.create({
      message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.',
      duration: 5000
    });

    toast.onDismiss(this.dismissHandler);
    toast.present();
  }

  showDismissDurationToast() {
    const toast = this.toastCtrl.create({
      message: 'I am dismissed after 1.5 seconds',
      duration: 1500
    });
    toast.onDismiss(this.dismissHandler);
    toast.present();
  }

  showToastWithCloseButton(positionString:string) {
    const toast = this.toastCtrl.create({
      message: 'Your internet connection appears to be offline. Data integrity is not gauranteed.',
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: positionString
    });
    toast.onDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler(toast: Toast) {
    console.info('Toast onDismiss()');
  }

}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
