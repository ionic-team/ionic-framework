import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  paused: boolean = false;

  toggleState() {
    this.paused = !this.paused;
  }
}
