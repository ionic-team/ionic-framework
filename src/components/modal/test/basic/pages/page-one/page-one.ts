import { Component } from '@angular/core';
import { Config, IonicPage, ModalController, NavController, Platform, ToastController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  platforms: string[];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    config: Config, plt: Platform) {
    console.log('platforms', plt.platforms());
    console.log('mode', config.get('mode'));

    console.log('isRTL', plt.isRTL);
    console.log('core', plt.is('core'));
    console.log('cordova', plt.is('cordova'));
    console.log('mobile', plt.is('mobile'));
    console.log('mobileweb', plt.is('mobileweb'));
    console.log('ipad', plt.is('ipad'));
    console.log('iphone', plt.is('iphone'));
    console.log('phablet', plt.is('phablet'));
    console.log('tablet', plt.is('tablet'));
    console.log('ios', plt.is('ios'));
    console.log('android', plt.is('android'));
    console.log('windows phone', plt.is('windows'));

    plt.ready().then((readySource: string) => {
      console.log('platform.ready, readySource:', readySource);
    });

    this.platforms = plt.platforms();
  }

  push() {
    this.navCtrl.push(PageOne);
  }

  presentModal() {
    let modal = this.modalCtrl.create('ModalPassData', { userId: 8675309 }, {
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out',
      cssClass: 'my-modal my-blue-modal'
    });
    modal.present();

    modal.onWillDismiss((data: any) => {
      console.log('WILL DISMISS with data', data);
      console.timeEnd('modal');
    });
    modal.onDidDismiss((data: any) => {
      console.log('DID DISMISS modal data', data);
      console.timeEnd('modal');
    });
  }

  presentModalChildNav() {
    this.modalCtrl.create('ContactUs', null, {
      enableBackdropDismiss: false
    }).present();
  }

  presentToolbarModal() {
    this.modalCtrl.create('ToolbarModal', null, {
      enterAnimation: 'modal-md-slide-in',
      leaveAnimation: 'modal-md-slide-out'
    }).present();
  }

  presentModalWithInputs() {
    let modal = this.modalCtrl.create('ModalWithInputs');
    modal.onDidDismiss((data: any) => {
      console.log('Modal with inputs data:', data);
    });
    modal.present();
  }

  presentNavModalWithToast() {
    this.toastCtrl.create({
      message: 'Will present a modal with child nav...',
      duration: 1000,
    }).present();

    setTimeout(() => {
      this.modalCtrl.create('ContactUs').present();
    }, 500);
  }

  presentToolbarModalWithToast() {
    this.toastCtrl.create({
      message: 'Will present a modal with toolbars...',
      duration: 1000,
    }).present();

    setTimeout(() => {
      this.modalCtrl.create('ToolbarModal').present();
    }, 500);
  }

  ionViewDidLoad() {
    console.log('E2EPage ionViewDidLoad fired');
  }

  ionViewWillEnter() {
    console.log('E2EPage ionViewWillEnter fired');
  }

  ionViewDidEnter() {
    console.log('E2EPage ionViewDidEnter fired');
  }

  ionViewWillLeave() {
    console.log('E2EPage ionViewWillLeave fired');
  }

  ionViewDidLeave() {
    console.log('E2EPage ionViewDidLeave fired');
  }
}
