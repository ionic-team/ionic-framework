import { Component, NgZone } from '@angular/core';
import {
  Platform,
  ModalController,
  AlertController,
  ActionSheetController,
  PopoverController,
  ToastController,
  PickerController,
  MenuController,
  LoadingController,
  NavController,
  DomController,
  Config,
} from '@ionic/angular';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
})
export class ProvidersComponent {
  isLoaded = false;
  isReady = false;
  isResumed = false;
  isPaused = false;
  isResized = false;
  isTesting?: boolean = undefined;
  isDesktop?: boolean = undefined;
  isMobile?: boolean = undefined;
  keyboardHeight = 0;
  queryParams = '';
  registeredMenuCount = 0;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private pickerCtrl: PickerController,
    modalCtrl: ModalController,
    platform: Platform,
    popoverCtrl: PopoverController,
    toastCtrl: ToastController,
    navCtrl: NavController,
    domCtrl: DomController,
    config: Config,
    zone: NgZone
  ) {
    // test all providers load
    if (
      actionSheetCtrl &&
      alertCtrl &&
      loadingCtrl &&
      menuCtrl &&
      pickerCtrl &&
      modalCtrl &&
      platform &&
      popoverCtrl &&
      toastCtrl &&
      navCtrl &&
      domCtrl &&
      config
    ) {
      this.isLoaded = true;
    }

    // test platform ready()
    platform.ready().then(() => {
      NgZone.assertInAngularZone();
      this.isReady = true;
    });
    platform.resume.subscribe(() => {
      console.log('platform:resume');
      NgZone.assertInAngularZone();
      this.isResumed = true;
    });
    platform.pause.subscribe(() => {
      console.log('platform:pause');
      NgZone.assertInAngularZone();
      this.isPaused = true;
    });
    platform.resize.subscribe(() => {
      console.log('platform:resize');
      NgZone.assertInAngularZone();
      this.isResized = true;
    });
    const firstQuery = platform.getQueryParam('firstParam');
    const secondQuery = platform.getQueryParam('secondParam');
    this.queryParams = `firstParam: ${firstQuery}, firstParam: ${secondQuery}`;

    this.isDesktop = platform.is('desktop');
    this.isMobile = platform.is('mobile');

    // test config
    this.isTesting = config.getBoolean('_testing');
    this.keyboardHeight = config.getNumber('keyboardHeight');

    zone.runOutsideAngular(() => {
      document.dispatchEvent(new CustomEvent('pause'));
      document.dispatchEvent(new CustomEvent('resume'));
      window.dispatchEvent(new CustomEvent('resize'));
    });
  }

  async setMenuCount() {
    const menus = await this.menuCtrl.getMenus();
    this.registeredMenuCount = menus.length;
  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: ['Button'],
    });

    await actionSheet.present();
  }

  async openAlert() {
    const alert = await this.alertCtrl.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
      header: 'Alert!',
    });

    await alert.present();
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await picker.present();
  }
}
