import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import {
  Platform,
  ModalController,
  AlertController,
  ActionSheetController,
  PopoverController,
  ToastController,
  MenuController,
  LoadingController,
  NavController,
  DomController,
  Config,
} from '@ionic/angular/lazy';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-providers',
    templateUrl: './providers.component.html',
    standalone: false
})
export class ProvidersComponent {
  isLoaded = false;
  isReady = false;
  isResumed = false;
  isPaused = false;
  isResized = false;
  resizeCount = 0;
  isTesting?: boolean = undefined;
  isDesktop?: boolean = undefined;
  isMobile?: boolean = undefined;
  keyboardHeight = 0;
  queryParams = '';
  registeredMenuCount = 0;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    modalCtrl: ModalController,
    platform: Platform,
    popoverCtrl: PopoverController,
    toastCtrl: ToastController,
    navCtrl: NavController,
    domCtrl: DomController,
    config: Config,
    zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // test all providers load
    if (
      actionSheetCtrl &&
      alertCtrl &&
      loadingCtrl &&
      menuCtrl &&
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
      assertZoneContext();
      this.isReady = true;
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own, so mark the view dirty.
      this.cdr.markForCheck();
    });
    platform.resume.subscribe(() => {
      console.log('platform:resume');
      assertZoneContext();
      this.isResumed = true;
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own, so mark the view dirty.
      this.cdr.markForCheck();
    });
    platform.pause.subscribe(() => {
      console.log('platform:pause');
      assertZoneContext();
      this.isPaused = true;
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own, so mark the view dirty.
      this.cdr.markForCheck();
    });
    platform.resize.subscribe(() => {
      console.log('platform:resize');
      assertZoneContext();
      this.isResized = true;
      this.resizeCount++;
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own, so mark the view dirty.
      this.cdr.markForCheck();
    });
    const firstQuery = platform.getQueryParam('firstParam');
    const secondQuery = platform.getQueryParam('secondParam');
    this.queryParams = `firstParam: ${firstQuery}, secondParam: ${secondQuery}`;

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
    // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own; mark the view dirty.
    this.cdr.markForCheck();
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

  async openLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 2000,
    });

    await loading.present();
  }
}
