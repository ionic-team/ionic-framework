import {App} from 'ionic-angular';

// Use the toolbar demo but pass in the demo name to change the title
@App({
  templateUrl: '../toolbar/main.html'
})
class ApiDemoApp {
  constructor() {
    this.demo = "Navbar";

    this.favorites = "recent";
    this.apps = "free";
  }
}
