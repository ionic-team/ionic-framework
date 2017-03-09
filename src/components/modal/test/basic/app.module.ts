import { Component, Injectable, NgModule } from '@angular/core';

import { ActionSheetController, AlertController, App, Config,
  IonicApp, IonicModule, ModalController, NavController,
  NavParams, Platform, ToastController, ViewController } from '../../../../../ionic-angular';


@Injectable()
export class SomeComponentProvider {
  constructor(public config: Config) {
    console.log('SomeComponentProvider constructor');
  }

  getName() {
    return 'Jenny';
  }
}

@Injectable()
export class SomeAppProvider {
  constructor(public config: Config) {
    console.log('SomeAppProvider constructor');
  }

  getData() {
    return 'Some data';
  }
}


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  platforms: string[];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    config: Config, plt: Platform) {
    console.log('platforms', plt.platforms());
    console.log('mode', config.get('mode'));

    console.log('isRTL', plt.isRTL());
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
    this.navCtrl.push(E2EPage);
  }

  presentModal() {
    let modal = this.modalCtrl.create(ModalPassData, { userId: 8675309 }, {
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out'
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
    this.modalCtrl.create(ContactUs, null, {
      enableBackdropDismiss: false
    }).present();
  }

  presentToolbarModal() {
    this.modalCtrl.create(ToolbarModal, null, {
      enterAnimation: 'modal-md-slide-in',
      leaveAnimation: 'modal-md-slide-out'
    }).present();
  }

  presentModalWithInputs() {
    let modal = this.modalCtrl.create(ModalWithInputs);
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
      this.modalCtrl.create(ContactUs).present();
    }, 500);
  }

  presentToolbarModalWithToast() {
    this.toastCtrl.create({
      message: 'Will present a modal with toolbars...',
      duration: 1000,
    }).present();

    setTimeout(() => {
      this.modalCtrl.create(ToolbarModal).present();
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


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Data in/out</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>UserId</ion-label>
          <ion-input type="number" [(ngModel)]="data.userId"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Name</ion-label>
          <ion-input [(ngModel)]="data.name"></ion-input>
        </ion-item>
      </ion-list>
      <button ion-button full (click)="submit()">Submit</button>
      <div padding>
        <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>
        <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>
        <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>
        <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>
        <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>
        <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>
        <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>
        <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>
      </div>
    </ion-content>
  `,
  providers: [SomeComponentProvider]
})
export class ModalPassData {
  data: any;
  called: any;

  constructor(
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    params: NavParams,
    someComponentProvider: SomeComponentProvider,
    someAppProvider: SomeAppProvider) {
    this.data = {
      userId: params.get('userId'),
      name: someComponentProvider.getName()
    };
    console.log('SomeAppProvider Data', someAppProvider.getData());

    this.called = {
      ionViewCanEnter: 0,
      ionViewCanLeave: 0,
      ionViewWillLoad: 0,
      ionViewDidLoad: 0,
      ionViewWillEnter: 0,
      ionViewDidEnter: 0,
      ionViewWillLeave: 0,
      ionViewDidLeave: 0
    };
  }

  submit() {
    console.time('modal');
    this.viewCtrl.dismiss(this.data).catch(() => {
      console.log('submit was cancelled');
    });
  }

  ionViewCanEnter() {
    console.log('ModalPassData ionViewCanEnter fired');
    this.called.ionViewCanEnter++;

    return true;
  }

  ionViewCanLeave() {
    console.log('ModalPassData ionViewCanLeave fired');
    this.called.ionViewCanLeave++;

    return new Promise((resolve: any, reject: any) => {
      this.alertCtrl.create()
        .setTitle('Do you want to submit?')
        .addButton({ text: 'Submit', handler: resolve })
        .addButton({ text: 'Cancel', role: 'cancel', handler: reject })
        .present();
    });
  }

  ionViewWillLoad() {
    console.log('ModalPassData ionViewWillLoad fired');
    this.called.ionViewWillLoad++;
  }

  ionViewDidLoad() {
    console.log('ModalPassData ionViewDidLoad fired');
    this.called.ionViewDidLoad++;
  }

  ionViewWillEnter() {
    console.log('ModalPassData ionViewWillEnter fired');
    this.called.ionViewWillEnter++;
  }

  ionViewDidEnter() {
    console.log('ModalPassData ionViewDidEnter fired');
    this.toastCtrl.create({
      message: 'test toast',
      duration: 1000
    }).present();
    this.called.ionViewDidEnter++;
  }

  ionViewWillLeave() {
    console.log('ModalPassData ionViewWillLeave fired');
    this.called.ionViewWillLeave++;
  }

  ionViewDidLeave() {
    console.log('ModalPassData ionViewDidLeave fired');
    this.called.ionViewDidLeave++;
  }
}


@Component({
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Toolbar 1</ion-title>
      </ion-toolbar>

      <ion-toolbar>
        <ion-title>Toolbar 2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <button ion-button block color="danger" (click)="dismiss()" class="e2eCloseToolbarModal">
        Dismission Modal
      </button>

      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel ipsum in purus mollis dictum eget vitae purus. Nulla ultrices est odio, a maximus velit pretium ac. Donec vel elementum mi. Proin elementum pulvinar neque, in lacinia nibh tempus auctor. Nam sapien velit, commodo ac nibh a, maximus ullamcorper nunc. Integer luctus tortor dignissim, dictum neque at, scelerisque purus. Vivamus nec erat vel magna posuere euismod. Sed ac augue eu tellus tincidunt fermentum eget sit amet nunc. Donec sit amet mi libero. Cras nunc arcu, ultrices nec sapien eu, convallis posuere libero. Pellentesque vulputate lacus eros, at lobortis lorem egestas et. Vestibulum tempus quam in efficitur lobortis. Maecenas consectetur consequat sem pharetra aliquet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>

      <div>Mauris ac ligula elit. Nulla pulvinar eget leo ut aliquet. Praesent sit amet luctus quam. Nam fringilla iaculis mi, ut maximus mauris molestie feugiat. Curabitur nec scelerisque elit. Nunc eu odio facilisis, tempor enim eget, venenatis sem. Sed vitae lorem vehicula, auctor orci ultrices, finibus mauris. Donec vitae pulvinar diam. Nulla luctus congue quam, sed lacinia arcu dictum a.</div>

      <div>Morbi laoreet magna elit, id dapibus massa varius consequat. Praesent rhoncus nunc quam, eu mollis velit commodo ut. Etiam euismod elit mi, non auctor velit blandit ut. Aenean vitae pulvinar mi, ac pretium tellus. Morbi eu auctor sem, sollicitudin cursus felis. Praesent vestibulum velit sed eros iaculis ornare. Praesent diam diam, pellentesque eget scelerisque sed, bibendum ut risus. Sed sed fermentum sem. Integer vel justo felis. Proin eget quam est. In sit amet ipsum sagittis, convallis ipsum fringilla, interdum ante. Etiam vel tincidunt mauris. Nunc feugiat eros nunc, et vestibulum metus mollis et. Nullam eu viverra velit, id ultrices nisl. Donec non enim elementum, laoreet sapien id, feugiat tellus.</div>

      <div>Sed pellentesque ipsum eget ante hendrerit maximus. Aliquam id venenatis nulla. Nullam in nibh at enim vestibulum ullamcorper. Nam felis dolor, lobortis vel est non, condimentum malesuada nisl. In metus sapien, malesuada at nulla in, pretium aliquam turpis. Quisque elementum purus mi, sed tristique turpis ultricies in. Donec feugiat dolor non ultricies ultricies. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin ut purus et diam porta cursus vitae semper mi. Donec fringilla tellus orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc vitae commodo sem. Duis vehicula quam sit amet imperdiet facilisis. Pellentesque eget dignissim neque, et scelerisque libero. Maecenas molestie metus sed orci cursus, in venenatis justo dapibus.</div>

      <div>Aenean rhoncus urna at interdum blandit. Donec ac massa nec libero vehicula tincidunt. Sed sit amet hendrerit risus. Aliquam vitae vestibulum ipsum, non feugiat orci. Vivamus eu rutrum elit. Nulla dapibus tortor non dignissim pretium. Nulla in luctus turpis. Etiam non mattis tortor, at aliquet ex. Nunc ut ante varius, auctor dui vel, volutpat elit. Nunc laoreet augue sit amet ultrices porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vestibulum pellentesque lobortis est, ut tincidunt ligula mollis sit amet. In porta risus arcu, quis pellentesque dolor mattis non. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;</div>

      <button ion-button block color="danger" (click)="dismiss()">
        Dismission Modal
      </button>
    </ion-content>
  `
})
export class ToolbarModal {

  constructor(public viewCtrl: ViewController, public alertCtrl: AlertController) {}

  ionViewDidEnter() {
    let alert = this.alertCtrl.create({
        title: 'Test',
        buttons: [
            {
                text: 'Something',
                role: 'cancel'
            }
        ]
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


@Component({
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons start>
          <button ion-button (click)="dismiss()" strong>Close</button>
        </ion-buttons>
        <ion-title>Modal w/ Inputs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form #addForm="ngForm" (submit)="save($event)" novalidate>
        <ion-list>
          <ion-item>
            <ion-label floating>Title <span [hidden]="data.title.valid">(Required)</span></ion-label>
            <ion-input [(ngModel)]="data.title" name="title" #title="ngModel" type="text" required autofocus></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Note <span [hidden]="data.note.valid">(Required)</span></ion-label>
            <ion-input [(ngModel)]="data.note" name="note" #note="ngModel" type="text" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Icon</ion-label>
            <ion-input [(ngModel)]="data.icon" name="icon" #icon="ngModel" type="text" autocomplete="on" autocorrect="on"></ion-input>
          </ion-item>
        </ion-list>
        <div padding>
          <button ion-button block large type="submit" [disabled]="!addForm.valid">Save</button>
        </div>
      </form>
    </ion-content>
  `
})
export class ModalWithInputs {
  data: any;

  constructor(public viewCtrl: ViewController) {
    this.data = {
      title: 'Title',
      note: 'Note',
      icon: 'home'
    };
  }

  public save(ev: any) {
    this.viewCtrl.dismiss(this.data);
  }

  public dismiss() {
    this.viewCtrl.dismiss(null);
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ContactUs {
  root = ModalFirstPage;

  constructor() {
    console.log('ContactUs constructor');
  }
  ionViewDidLoad() {
    console.log('ContactUs ionViewDidLoad');
  }
  ionViewWillEnter() {
    console.log('ContactUs ionViewWillEnter');
  }
  ionViewDidEnter() {
    console.log('ContactUs ionViewDidEnter');
  }
  ionViewWillLeave() {
    console.log('ContactUs ionViewWillLeave');
  }
  ionViewDidLeave() {
    console.log('ContactUs ionViewDidLeave');
  }
  ionViewWillUnload() {
    console.log('ContactUs ionViewWillUnload');
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>First Page Header</ion-title>
        <ion-buttons start>
          <button ion-button class="e2eCloseMenu" (click)="dismiss()" strong>Close</button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>
      <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>
      <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>
      <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>
      <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>
      <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>
      <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>
      <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>
      <p>
        <button ion-button (click)="push()">Push (Go to 2nd)</button>
      </p>
      <p>
        <button ion-button (click)="openActionSheet()">Open Action Sheet</button>
      </p>
      <p>
        <button ion-button (click)="openModal()">Open same modal</button>
      </p>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
      <ion-list>
        <ion-item *ngFor="let item of items">
          Item Number: {{item.value}}
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class ModalFirstPage {
  items: any[] = [];
  called: any;

  constructor(
    public navCtrl: NavController,
    public app: App,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
  ) {
    for (let i = 0; i < 50; i++) {
      this.items.push({
        value: (i + 1)
      });
    }

    this.called = {
      ionViewCanEnter: 0,
      ionViewCanLeave: 0,
      ionViewWillLoad: 0,
      ionViewDidLoad: 0,
      ionViewWillEnter: 0,
      ionViewDidEnter: 0,
      ionViewWillLeave: 0,
      ionViewDidLeave: 0
    };
  }

  push() {
    this.toastCtrl.create({
      message: 'Will push a page in a moment...',
      duration: 1000,
    }).present();

    setTimeout(() => {
      this.navCtrl.push(ModalSecondPage, {
        id: 8675309,
        myData: [1, 2, 3, 4]
      });
    }, 500);
  }

  dismiss() {
    this.navCtrl.parent.pop();
  }

  ionViewCanEnter() {
    console.log('ModalFirstPage ionViewCanEnter fired');
    this.called.ionViewCanEnter++;
    return true;
  }

  ionViewCanLeave() {
    console.log('ModalFirstPage ionViewCanLeave fired');
    this.called.ionViewCanLeave++;
    return true;
  }

  ionViewWillLoad() {
    console.log('ModalFirstPage ionViewWillLoad fired');
    this.called.ionViewWillLoad++;
  }

  ionViewDidLoad() {
    console.log('ModalFirstPage ionViewDidLoad fired');
    this.called.ionViewDidLoad++;
  }

  ionViewWillEnter() {
    console.log('ModalFirstPage ionViewWillEnter fired');
    this.called.ionViewWillEnter++;
  }

  ionViewDidEnter() {
    console.log('ModalFirstPage ionViewDidEnter fired');
    let alert = this.alertCtrl.create({
      title: 'Test',
      buttons: [
          {
              text: 'Something',
              role: 'cancel'
          }
      ]
    });
    alert.present();
    this.called.ionViewDidEnter++;
  }

  ionViewWillLeave() {
    console.log('ModalFirstPage ionViewWillLeave fired');
    this.called.ionViewWillLeave++;
  }

  ionViewDidLeave() {
    console.log('ModalFirstPage ionViewDidLeave fired');
    this.called.ionViewDidLeave++;
  }

  openModal() {
    this.modalCtrl.create(ContactUs).present();
  }

  openActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Go To Root',
          handler: () => {
            actionSheet.dismiss().then(() => {
              this.navCtrl.parent.pop();
            });

            // by default an alert will dismiss itself
            // however, we don't want to use the default
            // but rather fire off our own pop navigation
            // return false so it doesn't pop automatically
            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel this clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Second Page Header</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <p>
        <button ion-button (click)="navCtrl.pop()">Pop (Go back to 1st)</button>
      </p>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
    </ion-content>
  `
})
export class ModalSecondPage {
  constructor(public navCtrl: NavController, params: NavParams) {
    console.log('Second page params:', params);
  }

  ionViewDidLoad() {
    console.log('ModalSecondPage ionViewDidLoad');
  }

  ionViewWillEnter() {
    console.log('ModalSecondPage ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('ModalSecondPage ionViewDidEnter');
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
    ModalFirstPage,
    ModalSecondPage,
    ModalWithInputs,
    ContactUs,
    ModalPassData,
    ToolbarModal
  ],
  imports: [
    IonicModule.forRoot(E2EApp, {
      statusbarPadding: true,
      swipeBackEnabled: true
    })
  ],
  bootstrap: [IonicApp],
  providers: [SomeAppProvider],
  entryComponents: [
    E2EApp,
    E2EPage,
    ModalFirstPage,
    ModalSecondPage,
    ModalWithInputs,
    ContactUs,
    ModalPassData,
    ToolbarModal
  ]
})
export class AppModule {}

