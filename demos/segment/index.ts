import {App} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  constructor() {
    this.appType = "paid";
    this.safari = "links";
    this.news = "local";
    this.favorites = "recent";

    this.purchased = "all";
    this.mapStyle = "sat";
    this.teslaModels = "X";

    this.pet = "puppies";
    this.calendar = "day";
    this.proxy = "auto";
  }
}
