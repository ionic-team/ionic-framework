import {App} from '../../../../../ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  clearButton = true;

  toggleClear() {
    this.clearButton = !this.clearButton;
  }
}
