import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  clearButton = true;

  toggleClear() {
    this.clearButton = !this.clearButton;
  }
}
