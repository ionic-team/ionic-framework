import {App} from '../../../../../ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  blockButton = true;

  toggleBlock() {
    this.blockButton = !this.blockButton;
  }
}
