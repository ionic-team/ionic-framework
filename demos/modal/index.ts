import {Component} from '@angular/core';
import {ionicBootstrap, IonicApp, Config, Platform, ViewController} from 'ionic-angular';
import {Modal, NavController, NavParams, Animation} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class ModalFirstPage {
  myParam = '';

  constructor(public nav: NavController) {}

  openBasicModal() {
    let myModal = Modal.create(ModalContentPage);
    this.nav.present(myModal);
  }
  openModalWithParams() {
    let myModal = Modal.create(ModalContentPage, { 'myParam': this.myParam });
    this.nav.present(myModal);
  }
  openCustomAnimationModal() {
    let myModal = Modal.create(ModalContentPage, {
      animation: 'my-fade-in',
    });
    this.nav.present(myModal);
  }
}

@Component({
  templateUrl: "modal-content.html"
})
export class ModalContentPage {
  myParam: string;

  constructor(
    public nav: NavController,
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
  templateUrl: 'app.html'
})
class ApiDemoApp {
  root = ModalFirstPage;
}

ionicBootstrap(ApiDemoApp);


class FadeIn extends Animation {
  constructor(enteringView, leavingView) {
    super(enteringView.pageRef());
    this
      .easing('ease')
      .duration(1000)
      .fromTo('translateY', '0%', '0%')
      .fadeIn()
      .before.addClass('show-page');
  }
}
Animation.register('my-fade-in', FadeIn);

class FadeOut extends Animation {
  constructor(enteringView, leavingView) {
    super(leavingView.pageRef());
    this
      .easing('ease')
      .duration(500)
      .fadeOut()
      .before.addClass('show-page');
  }
}
Animation.register('my-fade-out', FadeOut);
