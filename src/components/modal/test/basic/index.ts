import { Component, Injectable } from '@angular/core';

import { ActionSheetController, App, Config, ionicBootstrap, ModalController, NavController, NavParams, PageTransition, Platform, TransitionOptions, ViewController } from '../../../../../src';


@Injectable()
class SomeComponentProvider {
  constructor(private config: Config) {
    console.log('SomeComponentProvider constructor');
  }

  getName() {
    return 'Jenny';
  }
}

@Injectable()
class SomeAppProvider {
  constructor(private config: Config) {
    console.log('SomeAppProvider constructor');
  }

  getData() {
    return 'Some data';
  }
}


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  platforms: string[];

  constructor(private nav: NavController, private modalCtrl: ModalController, config: Config, platform: Platform) {
    console.log('platforms', platform.platforms());
    console.log('mode', config.get('mode'));

    console.log('isRTL', platform.isRTL());
    console.log('core', platform.is('core'));
    console.log('cordova', platform.is('cordova'));
    console.log('mobile', platform.is('mobile'));
    console.log('mobileweb', platform.is('mobileweb'));
    console.log('ipad', platform.is('ipad'));
    console.log('iphone', platform.is('iphone'));
    console.log('phablet', platform.is('phablet'));
    console.log('tablet', platform.is('tablet'));
    console.log('ios', platform.is('ios'));
    console.log('android', platform.is('android'));
    console.log('windows phone', platform.is('windows'));

    platform.ready().then((readySource: string) => {
      console.log('platform.ready, readySource:', readySource);
    });

    this.platforms = platform.platforms();
  }

  presentModal() {
    let modal = this.modalCtrl.create(ModalPassData, { userId: 8675309 });
    modal.present();

    modal.onWillDismiss((data: any) => {
      console.log('WILL DISMISS with data', data);
      console.timeEnd('modal');
    });
    modal.onDidDismiss((data: any) => {
      console.log('modal data', data);
      console.timeEnd('modal');
    });
  }

  presentModalChildNav() {
    this.modalCtrl.create(ContactUs).present();
  }

  presentToolbarModal() {
    let modal = this.modalCtrl.create(ToolbarModal);
    modal.present();

    modal.subscribe((data: any) => {
      console.log('modal data', data);
    });
  }

  presentModalWithInputs() {
    let modal = this.modalCtrl.create(ModalWithInputs);
    modal.onDidDismiss((data: any) => {
      console.log('Modal with inputs data:', data);
    });
    modal.present();
  }

  presentModalCustomAnimation() {
    let modal = this.modalCtrl.create(ContactUs);
    modal.present({
      animation: 'my-fade-in'
    });
  }

  presentNavigableModal() {
    this.modalCtrl.create(NavigableModal).present();
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Page One</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <button full (click)="submit()">Submit</button>
  </ion-content>
  `
})
class NavigableModal {
  constructor(private nav: NavController) {
  }

  submit() {
    this.nav.push(NavigableModal2);
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Page Two</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <button full (click)="submit()">Submit</button>
  </ion-content>
  `
})
class NavigableModal2 {
  constructor(private navController: NavController) {
  }

  submit() {
    this.navController.pop();
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
      <button full (click)="submit()">Submit</button>
    </ion-content>
  `,
  providers: [SomeComponentProvider]
})
class ModalPassData {
  data: any;

  constructor(params: NavParams, private viewCtrl: ViewController, someComponentProvider: SomeComponentProvider, someAppProvider: SomeAppProvider) {
    this.data = {
      userId: params.get('userId'),
      name: someComponentProvider.getName()
    };
    console.log('SomeAppProvider Data', someAppProvider.getData());
  }

  submit() {
    console.time('modal');
    this.viewCtrl.dismiss(this.data);
  }

  ionViewLoaded() {
    console.log('ModalPassData ionViewLoaded fired');
  }

  ionViewWillEnter() {
    console.log('ModalPassData ionViewWillEnter fired');
  }

  ionViewDidEnter() {
    console.log('ModalPassData ionViewDidEnter fired');
  }

  ionViewWillLeave() {
    console.log('ModalPassData ionViewWillLeave fired');
  }

  ionViewDidLeave() {
    console.log('ModalPassData ionViewDidLeave fired');
  }
}


@Component({
  template: `
    <ion-header>
      <ion-toolbar primary>
        <ion-title>Toolbar 1</ion-title>
      </ion-toolbar>

      <ion-toolbar no-border-top>
        <ion-title>Toolbar 2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <button block danger (click)="dismiss()" class="e2eCloseToolbarModal">
        Dismission Modal
      </button>

      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel ipsum in purus mollis dictum eget vitae purus. Nulla ultrices est odio, a maximus velit pretium ac. Donec vel elementum mi. Proin elementum pulvinar neque, in lacinia nibh tempus auctor. Nam sapien velit, commodo ac nibh a, maximus ullamcorper nunc. Integer luctus tortor dignissim, dictum neque at, scelerisque purus. Vivamus nec erat vel magna posuere euismod. Sed ac augue eu tellus tincidunt fermentum eget sit amet nunc. Donec sit amet mi libero. Cras nunc arcu, ultrices nec sapien eu, convallis posuere libero. Pellentesque vulputate lacus eros, at lobortis lorem egestas et. Vestibulum tempus quam in efficitur lobortis. Maecenas consectetur consequat sem pharetra aliquet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</div>

      <div>Mauris ac ligula elit. Nulla pulvinar eget leo ut aliquet. Praesent sit amet luctus quam. Nam fringilla iaculis mi, ut maximus mauris molestie feugiat. Curabitur nec scelerisque elit. Nunc eu odio facilisis, tempor enim eget, venenatis sem. Sed vitae lorem vehicula, auctor orci ultrices, finibus mauris. Donec vitae pulvinar diam. Nulla luctus congue quam, sed lacinia arcu dictum a.</div>

      <div>Morbi laoreet magna elit, id dapibus massa varius consequat. Praesent rhoncus nunc quam, eu mollis velit commodo ut. Etiam euismod elit mi, non auctor velit blandit ut. Aenean vitae pulvinar mi, ac pretium tellus. Morbi eu auctor sem, sollicitudin cursus felis. Praesent vestibulum velit sed eros iaculis ornare. Praesent diam diam, pellentesque eget scelerisque sed, bibendum ut risus. Sed sed fermentum sem. Integer vel justo felis. Proin eget quam est. In sit amet ipsum sagittis, convallis ipsum fringilla, interdum ante. Etiam vel tincidunt mauris. Nunc feugiat eros nunc, et vestibulum metus mollis et. Nullam eu viverra velit, id ultrices nisl. Donec non enim elementum, laoreet sapien id, feugiat tellus.</div>

      <div>Sed pellentesque ipsum eget ante hendrerit maximus. Aliquam id venenatis nulla. Nullam in nibh at enim vestibulum ullamcorper. Nam felis dolor, lobortis vel est non, condimentum malesuada nisl. In metus sapien, malesuada at nulla in, pretium aliquam turpis. Quisque elementum purus mi, sed tristique turpis ultricies in. Donec feugiat dolor non ultricies ultricies. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin ut purus et diam porta cursus vitae semper mi. Donec fringilla tellus orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc vitae commodo sem. Duis vehicula quam sit amet imperdiet facilisis. Pellentesque eget dignissim neque, et scelerisque libero. Maecenas molestie metus sed orci cursus, in venenatis justo dapibus.</div>

      <div>Aenean rhoncus urna at interdum blandit. Donec ac massa nec libero vehicula tincidunt. Sed sit amet hendrerit risus. Aliquam vitae vestibulum ipsum, non feugiat orci. Vivamus eu rutrum elit. Nulla dapibus tortor non dignissim pretium. Nulla in luctus turpis. Etiam non mattis tortor, at aliquet ex. Nunc ut ante varius, auctor dui vel, volutpat elit. Nunc laoreet augue sit amet ultrices porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vestibulum pellentesque lobortis est, ut tincidunt ligula mollis sit amet. In porta risus arcu, quis pellentesque dolor mattis non. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;</div>

      <button block danger (click)="dismiss()" class="e2eCloseToolbarModal">
        Dismission Modal
      </button>
    </ion-content>
  `
})
class ToolbarModal {

  constructor(private viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.emit({
      toolbar: 'data'
    });
    this.viewCtrl.dismiss();
  }

}


@Component({
  template: `
    <ion-header>
      <ion-toolbar secondary>
        <ion-buttons start>
          <button (click)="dismiss()">Close</button>
        </ion-buttons>
        <ion-title>Modal w/ Inputs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form #addForm="ngForm" (submit)="save($event)" novalidate>
        <ion-list>
          <ion-item>
            <ion-label floating>Title <span [hidden]="title.valid">(Required)</span></ion-label>
            <ion-input formControlName="title" type="text" [(ngModel)]="data.title" #title="ngForm" required autofocus></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Note <span [hidden]="note.valid">(Required)</span></ion-label>
            <ion-input formControlName="note" type="text" [(ngModel)]="data.note" #note="ngForm" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Icon</ion-label>
            <ion-input formControlName="icon" type="text" [(ngModel)]="data.icon" #icon="ngForm" autocomplete="on" autocorrect="on"></ion-input>
          </ion-item>
        </ion-list>
        <div padding>
          <button block large type="submit" [disabled]="!addForm.valid">Save</button>
        </div>
      </form>
    </ion-content>
  `
})
class ModalWithInputs {
  data: any;

  constructor(private viewCtrl: ViewController) {
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
class ContactUs {
  root = ModalFirstPage;

  constructor() {
    console.log('ContactUs constructor');
  }
  ionViewLoaded() {
    console.log('ContactUs ionViewLoaded');
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
  ionViewDidUnload() {
    console.log('ContactUs ionViewDidUnload');
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>First Page Header</ion-title>
        <ion-buttons start>
          <button class="e2eCloseMenu" (click)="dismiss()">Close</button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <p>
        <button (click)="push()">Push (Go to 2nd)</button>
      </p>
      <p>
        <button (click)="openActionSheet()">Open Action Sheet</button>
      </p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <ion-list>
        <ion-item *ngFor="let item of items">
          Item Number: {{item.value}}
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
class ModalFirstPage {

  private items: any[];
  constructor(private nav: NavController, private app: App, private actionSheetCtrl: ActionSheetController) {
    this.items = [];
    for ( let i = 0; i < 50; i++ ) {
      this.items.push({
        value: (i + 1)
      });
    }
  }

  push() {
    let page = ModalSecondPage;
    let params = { id: 8675309, myData: [1, 2, 3, 4] };

    this.nav.push(page, params);
  }

  dismiss() {
    this.app.getRootNav().pop();
  }

  ionViewLoaded() {
    console.log('ModalFirstPage ionViewLoaded fired');
  }

  ionViewWillEnter() {
    console.log('ModalFirstPage ionViewWillEnter fired');
  }

  ionViewDidEnter() {
    console.log('ModalFirstPage ionViewDidEnter fired');
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
            // overlays are added and removed from the root navigation
            // find the root navigation, and pop this alert
            // when the alert is done animating out, then pop off the modal
            this.app.getRootNav().pop().then(() => {
              this.app.getRootNav().pop();
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
        <button (click)="nav.pop()">Pop (Go back to 1st)</button>
      </p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `
})
class ModalSecondPage {
  constructor(private nav: NavController, params: NavParams) {
    console.log('Second page params:', params);
  }

  ionViewLoaded() {
    console.log('ModalSecondPage ionViewLoaded');
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
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp, [SomeAppProvider]);


class FadeIn extends PageTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);
    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(1000)
      .fromTo('translateY', '0%', '0%')
      .fromTo('opacity', 0, 1, true)
      .before.addClass('show-page');
  }
}
PageTransition.register('my-fade-in', FadeIn);

class FadeOut extends PageTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);
    this
      .element(leavingView.pageRef())
      .easing('ease')
      .duration(500)
      .fromTo('opacity', 1, 0)
      .before.addClass('show-page');
  }
}
PageTransition.register('my-fade-out', FadeOut);
