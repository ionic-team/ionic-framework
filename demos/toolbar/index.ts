import {App} from 'ionic/ionic';

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  constructor() {
    this.demo = "Toolbar";

    this.favorites = "recent";
    this.apps = "free";
  }
}
