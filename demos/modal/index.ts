import {App, Page, IonicApp, Config, Platform} from 'ionic/ionic';
import {Modal, ActionSheet, NavController, NavParams, Animation} from 'ionic/ionic';


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
  constructor(modal: Modal) {
    this.modal = modal;
    this.myParam = '';
  }

  openBasicModal() {
    this.modal.open(ModalContentPage);
  }
  openModalWithParams() {
    this.modal.open(ModalContentPage, { 'myParam': this.myParam });
  }
  openCustomAnimationModal() {
    this.modal.open(ModalContentPage, {}, {
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out',
      handle: 'my-awesome-modal'
    });
  }
}

@Page({
    templateUrl: "modal-content.html"
})
export class ModalContentPage {
    constructor(
        nav: NavController,
        modal: Modal,
        actionSheet: ActionSheet,
        params: NavParams
    ) {
        this.nav = nav;
        this.modal = modal;
        this.actionSheet = actionSheet;
        this.myParam = params.get('myParam');
    }

    closeModal() {
      let modal = this.modal.get();
      if (modal) {
        modal.close();
      }
    }

    openActionSheet() {
        this.actionSheet.open({
            buttons: [
                { text: 'Share This' },
                { text: 'Move' }
            ],
            destructiveText: 'Delete',
            titleText: 'Modify your album',
            cancelText: 'Cancel',
            cancel: function() {
                console.log('Canceled');
            },
            destructiveButtonClicked: () => {
                console.log('Destructive clicked');
            },
            buttonClicked: function(index) {
                console.log('Button clicked', index);
                if (index == 1) { return false; }
                return true;
            }
        }).then(actionSheetRef => {
            this.actionSheetRef = actionSheetRef;
        });
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
