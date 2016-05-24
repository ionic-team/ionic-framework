import {ViewChild, ElementRef} from '@angular/core';
import {App, Page, Popover, NavController, Content, NavParams} from '../../../../../src';


@Page({
  template: `
    <ion-list radio-group [(ngModel)]="fontFamily" (change)="changeFontFamily()">
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
          <button (click)="changeBackground('white')" category="dot" class="dot-white" [class.selected]="background == 'white'"></button>
        </ion-col>
        <ion-col>
          <button (click)="changeBackground('tan')" category="dot" class="dot-tan" [class.selected]="background == 'tan'"></button>
        </ion-col>
        <ion-col>
          <button (click)="changeBackground('grey')" category="dot" class="dot-grey" [class.selected]="background == 'grey'"></button>
        </ion-col>
        <ion-col>
          <button (click)="changeBackground('black')" category="dot" class="dot-black" [class.selected]="background == 'black'"></button>
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
  `,
})
class PopoverRadioPage {
  background: string = 'white';
  contentEle: any;
  textEle: any;
  fontFamily;

  colors = {
    "white": {
      "bg": "#fff",
      "fg": "#000"
    },
    "tan": {
      "bg": "#f9f1e4",
      "fg": "#000"
    },
    "grey": {
      "bg": "#4c4b50",
      "fg": "#fff"
    },
    "black": {
      "bg": "#000",
      "fg": "#fff"
    },
  };

  constructor(private navParams: NavParams) {

  }

  ngOnInit() {
    if (this.navParams.data) {
      this.contentEle = this.navParams.data.contentEle;
      this.textEle = this.navParams.data.textEle;
    }
  }

  changeBackground(color) {
    this.background = color;
    this.contentEle.style.background = this.colors[color].bg;
    this.textEle.style.color = this.colors[color].fg;
  }

  changeFontSize(direction) {
    this.textEle.style.fontSize = direction;
  }

  changeFontFamily() {
    if (this.fontFamily) this.textEle.style.fontFamily = this.fontFamily;
  }
}


@Page({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item>Learn Ionic</button>
      <button ion-item>Documentation</button>
      <button ion-item>Showcase</button>
      <button ion-item>GitHub Repo</button>
    </ion-list>
  `
})
class PopoverListPage {

}


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;

  popover: any;

  constructor(private nav: NavController) {

  }

  presentListPopover(ev) {
    let popover = Popover.create(PopoverListPage);
    this.nav.present(popover, {
      ev: ev
    });
  }

  presentRadioPopover(ev) {
    let popover = Popover.create(PopoverRadioPage, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    this.nav.present(popover, {
      ev: ev
    });
  }

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}

document.body.innerHTML += '<link href="style.css" rel="stylesheet">'
