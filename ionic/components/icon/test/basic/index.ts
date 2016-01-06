import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.homeIcon = 'home';
    this.isActive = false;
    this.btnIcon = 'home';
  }

  updateIcon() {
    this.btnIcon = (this.btnIcon === 'home' ? 'star' : 'home');
  }
}
