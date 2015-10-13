import {NgControl, FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/angular2';

import {App} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/search-bar/search-bar';


function randomTitle() {
  var items = ['Soylent', 'Pizza', 'Pumpkin', 'Apple', 'Bologna', 'Turkey', 'Kabob', 'Salad', 'Fruit bowl', 'Fish Tacos', 'Chimichongas', 'Meatloaf'];
  return items[Math.floor(Math.random() * items.length)];
}

@App({
  templateUrl: 'main.html',
  bindings: [NgControl],
  directives: [FORM_DIRECTIVES]
})
class IonicApp {
  constructor() {
    var fb = new FormBuilder();
    this.searchQuery = '';

    this.items = []
    for(let i = 0; i < 100; i++) {
      this.items.push({
        title: randomTitle()
      })
    }
  }

  doThis() {
    console.log('Doing this');
  }

  getItems() {
    var q = this.searchQuery;
    console.log('Its changing');
    if(q.trim() == '') {
      return this.items;
    }
    return this.items.filter((v) => {
      if(v.title.toLowerCase().indexOf(q.toLowerCase()) >= 0) {
        return true;
      }
      return false;
    })
  }
}
