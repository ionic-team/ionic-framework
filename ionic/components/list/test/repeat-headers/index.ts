import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.people = [
      {"name": "Adam Bradley", "components": [ "app", "badge", "button", "card"]},
      {"name": "Max Lynch", "components": [ "checkbox", "content", "form"]},
      {"name": "Tim Lancina", "components": [ "tabs"]}
    ];
  }
}
