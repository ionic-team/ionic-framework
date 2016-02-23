import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.groups = [];

    var letters = "abcdefghijklmnopqrstuvwxyz".split('');

    for(let i = 0; i < letters.length; i++) {
      let group = [];
      for(let j = 0; j < 10; j++) {
        group.push({
          title: letters[i] + j
        });
      }
      this.groups.push({
        title: letters[i].toUpperCase(),
        items: group
      });
    }
  }
}
