import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  url;

  constructor() {
    this.url = 'hello';
  }
}
