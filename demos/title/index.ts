import {App} from 'ionic-angular';

// Use the toolbar demo but pass in the demo name to change the title
// this will also hide some of the toolbars that don't use `ion-title`
@App({
  templateUrl: '../toolbar/main.html'
})
class ApiDemoApp {
  constructor() {
    this.demo = "Title";

    this.favorites = "recent";
    this.apps = "free";
  }
}
