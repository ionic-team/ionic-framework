import { Component, ViewChild, ElementRef, ViewEncapsulation, NgModule } from '@angular/core';
import { IonicApp, IonicModule, PopoverController, NavParams, ViewController } from '../../../..';


@Component({
  template: `
    <ion-content>
      <ion-list radio-group [(ngModel)]="fontFamily" (ionChange)="changeFontFamily()">
        <ion-row>
          <ion-col>
            <button (click)="changeFontSize('smaller')" ion-item detail-none class="text-button text-smaller">A</button>
          </ion-col>
          <ion-col>
            <button (click)="changeFontSize('larger')" ion-item detail-none class="text-button text-larger">A</button>
          </ion-col>
        </ion-row>
        <ion-row class="row-dots">
          <ion-col>
            <button ion-button="dot" (click)="changeBackground('white')" class="dot-white" [class.selected]="background == 'white'"></button>
          </ion-col>
          <ion-col>
            <button ion-button="dot" (click)="changeBackground('tan')" class="dot-tan" [class.selected]="background == 'tan'"></button>
          </ion-col>
          <ion-col>
            <button ion-button="dot" (click)="changeBackground('grey')" class="dot-grey" [class.selected]="background == 'grey'"></button>
          </ion-col>
          <ion-col>
            <button ion-button="dot" (click)="changeBackground('black')" class="dot-black" [class.selected]="background == 'black'"></button>
          </ion-col>
        </ion-row>
        <ion-item class="text-athelas">
          <ion-label>Athelas</ion-label>
          <ion-radio value="Athelas"></ion-radio>
        </ion-item>
        <ion-item class="text-charter">
          <ion-label>Charter</ion-label>
          <ion-radio value="Charter"></ion-radio>
        </ion-item>
        <ion-item class="text-iowan">
          <ion-label>Iowan</ion-label>
          <ion-radio value="Iowan"></ion-radio>
        </ion-item>
        <ion-item class="text-palatino">
          <ion-label>Palatino</ion-label>
          <ion-radio value="Palatino"></ion-radio>
        </ion-item>
        <ion-item class="text-san-francisco">
          <ion-label>San Francisco</ion-label>
          <ion-radio value="San Francisco"></ion-radio>
        </ion-item>
        <ion-item class="text-seravek">
          <ion-label>Seravek</ion-label>
          <ion-radio value="Seravek"></ion-radio>
        </ion-item>
        <ion-item class="text-times-new-roman">
          <ion-label>Times New Roman</ion-label>
          <ion-radio value="Times New Roman"></ion-radio>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class PopoverRadioPage {
  background: string;
  contentEle: any;
  textEle: any;
  fontFamily: any;

  colors: any = {
    'white': {
      'bg': 'rgb(255, 255, 255)',
      'fg': 'rgb(0, 0, 0)'
    },
    'tan': {
      'bg': 'rgb(249, 241, 228)',
      'fg': 'rgb(0, 0, 0)'
    },
    'grey': {
      'bg': 'rgb(76, 75, 80)',
      'fg': 'rgb(255, 255, 255)'
    },
    'black': {
      'bg': 'rgb(0, 0, 0)',
      'fg': 'rgb(255, 255, 255)'
    },
  };

  constructor(private navParams: NavParams) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.contentEle = this.navParams.data.contentEle;
      this.textEle = this.navParams.data.textEle;

      this.background = this.getColorName(this.contentEle.style.backgroundColor);
      this.setFontFamily();
    }
  }

  getColorName(background: any) {
    let colorName = 'white';

    if (!background) return 'white';

    for (var key in this.colors) {
      if (this.colors[key].bg === background) {
        colorName = key;
      }
    }

    return colorName;
  }

  setFontFamily() {
    if (this.textEle.style.fontFamily) {
      this.fontFamily = this.textEle.style.fontFamily.replace(/'/g, '');
    }
  }

  changeBackground(color: any) {
    this.background = color;
    this.contentEle.style.backgroundColor = this.colors[color].bg;
    this.textEle.style.color = this.colors[color].fg;
  }

  changeFontSize(direction: any) {
    this.textEle.style.fontSize = direction;
  }

  changeFontFamily() {
    if (this.fontFamily) this.textEle.style.fontFamily = this.fontFamily;
  }
}


@Component({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item (click)="close()">Learn Ionic</button>
      <button ion-item (click)="close()">Documentation</button>
    </ion-list>
  `
})
export class PopoverListPage {
  constructor(private viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  template: `
    <ion-content>
      <ion-list>
        <ion-list-header>Ionic</ion-list-header>
        <button ion-item *ngFor="let item of items">Item {{item}}</button>
      </ion-list>
    </ion-content>
  `
})
export class PopoverLongListPage {
  items: number[] = [];

  ngOnInit() {
    for (let i = 1; i < 21; i++) {
      this.items.push(i);
    }
  }
}


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;

  constructor(private popoverCtrl: PopoverController) {}

  presentListPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(PopoverListPage);
    popover.present({
      ev: ev
    });
  }

  presentLongListPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(PopoverLongListPage, {}, {
      cssClass: 'my-popover popover-class'
    });
    popover.present({
      ev: ev
    });
  }

  presentRadioPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(PopoverRadioPage, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    popover.present({
      ev: ev
    });
  }

  presentNoEventPopover() {
    this.popoverCtrl.create(PopoverListPage).present();
  }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  encapsulation: ViewEncapsulation.None
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
    PopoverRadioPage,
    PopoverListPage,
    PopoverLongListPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage,
    PopoverRadioPage,
    PopoverListPage,
    PopoverLongListPage
  ]
})
export class AppModule {}
