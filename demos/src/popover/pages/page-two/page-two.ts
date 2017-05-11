import { Component } from '@angular/core';
import { NavParams } from '../../../../../src';

@Component({
  selector: 'page-api-radio-popover',
  template: `
    <ion-list radio-group [(ngModel)]="fontFamily" (ionChange)="changeFontFamily()">
      <ion-row>
        <ion-col>
          <button (click)="changeFontSize('smaller')" ion-item detail-none class="popover-text-button popover-text-smaller">A</button>
        </ion-col>
        <ion-col>
          <button (click)="changeFontSize('larger')" ion-item detail-none class="popover-text-button popover-text-larger">A</button>
        </ion-col>
      </ion-row>
      <ion-row class="popover-row-dots">
        <ion-col>
          <button (click)="changeBackground('white')" ion-button="popover-dot" class="popover-dot-white" [class.selected]="background == 'white'"></button>
        </ion-col>
        <ion-col>
          <button (click)="changeBackground('tan')" ion-button="popover-dot" class="popover-dot-tan" [class.selected]="background == 'tan'"></button>
        </ion-col>
        <ion-col>
          <button (click)="changeBackground('grey')" ion-button="popover-dot" class="popover-dot-grey" [class.selected]="background == 'grey'"></button>
        </ion-col>
        <ion-col>
          <button (click)="changeBackground('black')" ion-button="popover-dot" class="popover-dot-black" [class.selected]="background == 'black'"></button>
        </ion-col>
      </ion-row>
      <ion-item class="popover-text-athelas">
        <ion-label>Athelas</ion-label>
        <ion-radio value="Athelas"></ion-radio>
      </ion-item>
      <ion-item class="popover-text-charter">
        <ion-label>Charter</ion-label>
        <ion-radio value="Charter"></ion-radio>
      </ion-item>
      <ion-item class="popover-text-iowan">
        <ion-label>Iowan</ion-label>
        <ion-radio value="Iowan"></ion-radio>
      </ion-item>
      <ion-item class="popover-text-palatino">
        <ion-label>Palatino</ion-label>
        <ion-radio value="Palatino"></ion-radio>
      </ion-item>
      <ion-item class="popover-text-san-francisco">
        <ion-label>San Francisco</ion-label>
        <ion-radio value="San Francisco"></ion-radio>
      </ion-item>
      <ion-item class="popover-text-seravek">
        <ion-label>Seravek</ion-label>
        <ion-radio value="Seravek"></ion-radio>
      </ion-item>
      <ion-item class="popover-text-times-new-roman">
        <ion-label>Times New Roman</ion-label>
        <ion-radio value="Times New Roman"></ion-radio>
      </ion-item>
    </ion-list>
  `,
})
export class PageTwo {
  background: string;
  contentEle: any;
  textEle: any;
  fontFamily: string;

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

  constructor(private navParams: NavParams) {

  }

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

  changeFontSize(direction: string) {
    this.textEle.style.fontSize = direction;
  }

  changeFontFamily() {
    if (this.fontFamily) this.textEle.style.fontFamily = this.fontFamily;
  }
}
