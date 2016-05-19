import {App} from '../../../../../src';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  outlineButton = true;

  toggleOutline() {
    this.outlineButton = !this.outlineButton;
  }
}
