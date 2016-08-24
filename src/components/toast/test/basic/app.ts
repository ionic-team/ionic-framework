import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Toast, ToastController, NavController } from '../../../..';


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
export class AnotherPage {}


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {

  constructor(public toastCtrl: ToastController, public navCtrl: NavController) { }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'User was created successfully'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

    setTimeout(() => {
      this.navCtrl.push(AnotherPage);
    }, 1000);

    setTimeout(() => {
      toast.dismiss();
    }, 2000);
  }

  showLongToast() {
    const toast = this.toastCtrl.create({
      message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.',
      duration: 5000,
      cssClass: 'custom-class my-toast'
    });

    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  showDismissDurationToast() {
    const toast = this.toastCtrl.create({
      message: 'I am dismissed after 1.5 seconds',
      duration: 1500
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  showToastWithCloseButton(positionString: string) {
    const toast = this.toastCtrl.create({
      message: 'Your internet connection appears to be offline. Data integrity is not gauranteed.',
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: positionString
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler(toast: Toast) {
    console.info('Toast onDidDismiss()');
  }

}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
    AnotherPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage,
    AnotherPage
  ]
})
export class AppModule {}
