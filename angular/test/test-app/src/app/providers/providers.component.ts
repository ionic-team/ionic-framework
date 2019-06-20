import { Component } from '@angular/core';
import {
  Platform, ModalController, AlertController, ActionSheetController,
  PopoverController, ToastController, Events, PickerController, MenuController,
  LoadingController, NavController, DomController, Config
} from '@ionic/angular';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
})
export class ProvidersComponent {

  isLoaded = false;
  isReady = false;
  isEvent = false;
  isTesting: boolean = undefined;
  isDesktop: boolean = undefined;
  isMobile: boolean = undefined;
  keyboardHeight = 0;

  constructor(
    actionSheetCtrl: ActionSheetController,
    alertCtrl: AlertController,
    events: Events,
    loadingCtrl: LoadingController,
    menuCtrl: MenuController,
    pickerCtrl: PickerController,
    modalCtrl: ModalController,
    platform: Platform,
    popoverCtrl: PopoverController,
    toastCtrl: ToastController,
    navCtrl: NavController,
    domCtrl: DomController,
    config: Config
  ) {
    // test all providers load
    if (
      actionSheetCtrl && alertCtrl && events && loadingCtrl && menuCtrl && pickerCtrl &&
      modalCtrl && platform && popoverCtrl && toastCtrl && navCtrl && domCtrl && config
      ) {
        this.isLoaded = true;
      }

    // test platform ready()
    platform.ready().then(() => {
      this.isReady = true;
    });

    this.isDesktop = platform.is('desktop');
    this.isMobile = platform.is('mobile');

    // test events
    events.subscribe('topic', () => {
      this.isEvent = true;
    });
    events.publish('topic');

    // test config
    this.isTesting = config.getBoolean('_testing');
    config.set('keyboardHeight', 12345);
    this.keyboardHeight = config.getNumber('keyboardHeight');
  }
}
