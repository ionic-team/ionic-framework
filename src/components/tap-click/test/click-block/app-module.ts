import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { IonicApp, IonicModule, Menu, MenuController, ModalController, NavController, NavParams, ToastController, ViewController } from '../../../..';


@Component({
  templateUrl: 'modal.html'
})
export class ModalPage {
 constructor(public viewCtrl: ViewController) {}
  close() {
    this.viewCtrl.dismiss();
  }
}

@Component({
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None
})
export class SearchPage {
  items: string[];
  anyPop: boolean = false;
  index: number = 1;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    params: NavParams,
  ) {
    let index = params.get('index');
    if (index) {
      this.index = index;
    } else {
      this.index = 1;
    }
  }

  showToast(message) {
    this.toastCtrl.create({
      message: 'Clicked: ' + message,
      duration: 800
    }).present();

    if (this.anyPop) {
      this.navCtrl.pop().catch(() => {
        console.debug('impossible to pop()');
      });
      return false;
    }
    return true;
  }

  push() {
    if (this.showToast('push')) {
      this.navCtrl.push(SearchPage, {
        index: this.index + 1
      });
    }
  }

  openModal() {
    let modal = this.modalCtrl.create(ModalPage);
    modal.present();
  }

  openMenu() {
    if (this.showToast('menu')) {
      this.menuCtrl.open();
    }
  }
}

@Component({
  template: `
<ion-menu [content]="content" type="overlay" #menu>

  <ion-header>
    <ion-toolbar color="danger">
      <ion-title>Left Menu</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-list>

      <button ion-item menuClose detail-none>
        Close Menu
      </button>

      <button ion-item (click)="fastClose(menu)" detail-none>
        Close Menu (instant)
      </button>

      <button ion-item menuClose detail-none>
        Close Menu
      </button>

      <button ion-item (click)="fastClose(menu)" detail-none>
        Close Menu (instant)
      </button>

      <button ion-item menuClose detail-none>
        Close Menu
      </button>

      <button ion-item (click)="fastClose(menu)" detail-none>
        Close Menu (instant)
      </button>

      <button ion-item menuClose detail-none>
        Close Menu
      </button>

      <button ion-item (click)="fastClose(menu)" detail-none>
        Close Menu (instant)
      </button>

      <button ion-item menuClose detail-none>
        Close Menu
      </button>

      <button ion-item (click)="fastClose(menu)" detail-none>
        Close Menu (instant)
      </button>

      <button ion-item menuClose detail-none>
        Close Menu
      </button>

      <button ion-item (click)="fastClose(menu)" detail-none>
        Close Menu (instant)
      </button>

      <button ion-item menuClose detail-none>
        Close Menu
      </button>

    </ion-list>

  </ion-content>

</ion-menu>
<ion-nav [root]="root" #content></ion-nav>`
})
export class E2EApp {
  root = SearchPage;

  fastClose(menu: Menu) {
    menu.setOpen(false, false);
  }
}

@NgModule({
  declarations: [
    E2EApp,
    SearchPage,
    ModalPage,
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    SearchPage,
    ModalPage,
  ]
})
export class AppModule {}
