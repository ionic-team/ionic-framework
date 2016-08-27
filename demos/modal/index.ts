import { Component } from '@angular/core';

import { Animation, ionicBootstrap, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class ModalFirstPage {
  myParam = '';

  constructor(public modalCtrl: ModalController) {}

  openBasicModal() {
    let myModal = this.modalCtrl.create(ModalContentPage);
    myModal.present();
  }
  openModalWithParams() {
    let myModal = this.modalCtrl.create(ModalContentPage, { 'myParam': this.myParam });
    myModal.present();
  }
  openCustomAnimationModal() {
    let myModal = this.modalCtrl.create(ModalContentPage, {
      animation: 'my-fade-in',
    });
    myModal.present();
  }
}


@Component({
  templateUrl: "modal-content.html"
})
export class ModalContentPage {
  myParam: string;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.myParam = params.get('myParam');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ModalFirstPage;
}

ionicBootstrap(ApiDemoApp);


class FadeIn extends Animation {
  constructor(enteringView: ViewController, leavingView: ViewController) {
    super(enteringView.pageRef());
    this
      .easing('ease')
      .duration(1000)
      .fromTo('translateY', '0%', '0%')
      .fromTo('opacity', 0, 1)
      .before.addClass('show-page');
  }
}
Animation.register('my-fade-in', FadeIn);

class FadeOut extends Animation {
  constructor(enteringView: ViewController, leavingView: ViewController) {
    super(leavingView.pageRef());
    this
      .easing('ease')
      .duration(500)
      .fromTo('opacity', 1, 0)
      .before.addClass('show-page');
  }
}
Animation.register('my-fade-out', FadeOut);
