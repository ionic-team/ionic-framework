import {App} from '../../../../../src';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  blockButton = true;

  toggleBlock() {
    this.blockButton = !this.blockButton;
  }
}
