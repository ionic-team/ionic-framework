import {App, NavController} from 'ionic/ionic';
import {FirstPage} from './pages/first-page';


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  constructor() {
    this.root = FirstPage;
  }
}
