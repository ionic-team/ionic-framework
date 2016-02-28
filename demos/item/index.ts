import {App} from 'ionic-angular';

// Uses the list's demo but passes the demo var to change the title
@App({
  templateUrl: '../list/main.html'
})
class ApiDemoApp {
  constructor() {
    this.demo = "Item";
  }
}
