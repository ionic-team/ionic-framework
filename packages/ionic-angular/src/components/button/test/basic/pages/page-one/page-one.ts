import { Component } from '@angular/core';
import { App } from '../../../../../..';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  btnColor: string;
  testingColors = ['primary', 'secondary', 'danger', 'dark'];
  testingColorIndex = 0;

  constructor(app: App) {
    app.setTitle('Basic Buttons');
    this.chgColor();
  }

  chgColor() {
    this.btnColor = this.testingColors[this.testingColorIndex];
    console.log('dynamic btnColor', this.btnColor);
    this.testingColorIndex = (this.testingColorIndex >= this.testingColors.length - 1 ? 0 : this.testingColorIndex + 1);
  }

  test(ev: UIEvent) {
    console.log(`button click from: ${ev.type}, timestamp: ${Date.now()}`);
  }
}
