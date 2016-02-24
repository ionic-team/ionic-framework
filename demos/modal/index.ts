import {App, Page, IonicApp, Config, Platform, ViewController} from 'ionic-angular';
import {Modal, NavController, NavParams, Animation} from 'ionic-angular';


@App({
  templateUrl: 'app.html'
})
class ApiDemoApp {

  constructor() {
    this.rootPage = ModalFirstPage;
  }
}

@Page({
  templateUrl: 'main.html'
})
export class ModalFirstPage {
  constructor(nav: NavController) {
    this.nav = nav;
    this.myParam = '';
  }

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

@Page({
    templateUrl: "modal-content.html"
})
export class ModalContentPage {
    constructor(
        nav: NavController,
        params: NavParams,
        viewCtrl: ViewController
    ) {
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        this.myParam = params.get('myParam');
    }

    dismiss() {
      this.viewCtrl.dismiss();
    }
}


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
