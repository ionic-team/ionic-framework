import {App, IonicApp} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(app: IonicApp) {
    app.setTitle('Basic Buttons');

    this.testingColors = ['primary', 'secondary', 'danger', 'dark'];
    this.testingColorIndex = 0;
    this.chgColor();
  }

  chgColor() {
    this.btnColor = this.testingColors[this.testingColorIndex];
    console.log('dynamic btnColor', this.btnColor);
    this.testingColorIndex = (this.testingColorIndex >= this.testingColors.length - 1 ? 0 : this.testingColorIndex + 1);
  }
}
