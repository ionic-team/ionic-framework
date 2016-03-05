import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  outlineButton = true;

  toggleOutline() {
    this.outlineButton = !this.outlineButton;
  }
}
