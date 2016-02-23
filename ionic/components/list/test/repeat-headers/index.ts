import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.people = [
      {"name": "Adam Bradley", "components": [ "all the things"]},
      {"name": "Max Lynch", "components": [ "checkbox", "content", "form"]},
      {"name": "Tim Lancina", "components": [ "tabs"]}
    ];
  }
}
