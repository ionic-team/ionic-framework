import {App} from 'ionic/ionic';

@App({
  templateUrl: 'main.html'
})

class DemoApp {

  constructor() {
    this.isHidden = false;
  }

  toggle() {
    this.isHidden = !this.isHidden;
  }

}