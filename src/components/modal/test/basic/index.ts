import {Component} from '@angular/core';
import {ionicBootstrap, Config, Platform} from '../../../../../src';
import {Modal, ActionSheet, NavController, NavParams, Transition, TransitionOptions, ViewController} from '../../../../../src';

@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  platforms;

  constructor(private nav: NavController, config: Config, platform: Platform) {
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

    platform.ready().then((readySource) => {
      console.log('platform.ready, readySource:', readySource);
    });

    this.platforms = platform.platforms();
  }

  presentModal() {
    let modal = Modal.create(ModalPassData, { userId: 8675309 });
    this.nav.present(modal);

    modal.onDismiss(data => {
      console.log('modal data', data);
    });
  }

  presentModalChildNav() {
    let modal = Modal.create(ContactUs);
    this.nav.present(modal);
  }

  presentToolbarModal() {
    let modal = Modal.create(ToolbarModal);
    this.nav.present(modal);

    modal.subscribe(data => {
      console.log('modal data', data);
    });
  }

  presentModalWithInputs() {
	  let modal = Modal.create(ModalWithInputs);
    modal.onDismiss((data) => {
      console.log('Modal with inputs data:', data);
    });
    this.nav.present(modal);
  }

  presentModalCustomAnimation() {
    let modal = Modal.create(ContactUs);
    this.nav.present(modal, {
      animation: 'my-fade-in'
    });
  }

  presentNavigableModal(){
    let modal = Modal.create(NavigableModal);
    this.nav.present(modal);
    //this.nav.push(NavigableModal);
  }
}

@Component({
  template: `
  <ion-navbar *navbar>
    <ion-title>Page One</ion-title>
  </ion-navbar>
  <ion-content>
    <button full (click)="submit()">Submit</button>
  </ion-content>
  `
})
class NavigableModal{
  constructor(private navController:NavController){
  }

  submit(){
    this.navController.push(NavigableModal2);
  }
}

@Component({
  template: `
  <ion-navbar *navbar>
    <ion-title>Page Two</ion-title>
  </ion-navbar>
  <ion-content>
    <button full (click)="submit()">Submit</button>
  </ion-content>
  `
})
class NavigableModal2{
  constructor(private navController:NavController){
  }

  submit(){
    this.navController.pop();
  }
}



@Component({
  template: `
    <ion-navbar *navbar>
      <ion-title>Data in/out</ion-title>
    </ion-navbar>
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
  `
})
class ModalPassData {
  data;

  constructor(params: NavParams, private viewCtrl: ViewController) {
    this.data = {
      userId: params.get('userId'),
      name: 'Jenny'
    };
  }

  submit() {
    this.viewCtrl.dismiss(this.data);
  }

  ionViewLoaded(){
    console.log("ModalPassData ionViewLoaded fired");
  }

  ionViewWillEnter(){
    console.log("ModalPassData ionViewWillEnter fired");
  }

  ionViewDidEnter(){
    console.log("ModalPassData ionViewDidEnter fired");
  }

  ionViewWillLeave(){
    console.log("ModalPassData ionViewWillLeave fired");
  }

  ionViewDidLeave(){
    console.log("ModalPassData ionViewDidLeave fired");
  }
}


@Component({
  template: `
    <ion-toolbar primary>
      <ion-title>Toolbar 1</ion-title>
    </ion-toolbar>

    <ion-toolbar>
      <ion-title>Toolbar 2</ion-title>
    </ion-toolbar>

    <ion-content padding>
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
    <ion-toolbar secondary>
      <ion-buttons start>
        <button (click)="dismiss()">Close</button>
      </ion-buttons>
      <ion-title>Modal w/ Inputs</ion-title>
    </ion-toolbar>
    <ion-content>
      <form #addForm="ngForm" (submit)="save($event)" novalidate>
        <ion-list>
          <ion-item>
            <ion-label floating>Title <span [hidden]="title.valid">(Required)</span></ion-label>
            <ion-input ngControl="title" type="text" [(ngModel)]="data.title" #title="ngForm" required autofocus></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Note <span [hidden]="note.valid">(Required)</span></ion-label>
            <ion-input ngControl="note" type="text" [(ngModel)]="data.note" #note="ngForm" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Icon</ion-label>
            <ion-input ngControl="icon" type="text" [(ngModel)]="data.icon" #icon="ngForm" autocomplete="on" autocorrect="on"></ion-input>
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
  data;

  constructor(private viewCtrl: ViewController) {
    this.data = {
      title: 'Title',
      note: 'Note',
      icon: 'home'
    };
  }

  public save(ev) {
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
  root;

  constructor() {
    console.log('ContactUs constructor');
    this.root = ModalFirstPage;
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
    <ion-navbar *navbar>
      <ion-title>First Page Header</ion-title>
      <ion-buttons start>
        <button class="e2eCloseMenu" (click)="dismiss()">Close</button>
      </ion-buttons>
    </ion-navbar>
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

  private items:any[];
  constructor(private nav: NavController) {
    this.items = [];
    for ( let i = 0; i < 50; i++ ){
      this.items.push({
        value: (i + 1)
      });
    }
  }

  push() {
    let page = ModalSecondPage;
    let params = { id: 8675309, myData: [1,2,3,4] };

    this.nav.push(page, params);
  }

  dismiss() {
    this.nav.rootNav.pop();
  }

  ionViewLoaded(){
    console.log("ModalFirstPage ionViewLoaded fired");
  }

  ionViewWillEnter(){
    console.log("ModalFirstPage ionViewWillEnter fired");
  }

  ionViewDidEnter(){
    console.log("ModalFirstPage ionViewDidEnter fired");
  }

  openActionSheet() {
    let actionSheet = ActionSheet.create({
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
            this.nav.rootNav.pop().then(() => {
              this.nav.rootNav.pop();
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

    this.nav.present(actionSheet);
  }
}


@Component({
  template: `
    <ion-navbar *navbar>
      <ion-title>Second Page Header</ion-title>
    </ion-navbar>
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

  ionViewLoaded(){
    console.log("ModalSecondPage ionViewLoaded");
  }

  ionViewWillEnter(){
    console.log("ModalSecondPage ionViewWillEnter");
  }

  ionViewDidEnter(){
    console.log("ModalSecondPage ionViewDidEnter");
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);


class FadeIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);
    this
      .element(enteringView.pageRef())
      .easing('ease')
      .duration(1000)
      .fromTo('translateY', '0%', '0%')
      .fadeIn()
      .before.addClass('show-page');
  }
}
Transition.register('my-fade-in', FadeIn);

class FadeOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);
    this
      .element(leavingView.pageRef())
      .easing('ease')
      .duration(500)
      .fadeOut()
      .before.addClass('show-page');
  }
}
Transition.register('my-fade-out', FadeOut);