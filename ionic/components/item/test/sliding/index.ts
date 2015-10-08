import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    setTimeout(() => {
      this.shouldShow = true;
    }, 5000);
  }
}
