import {NgControl} from 'angular2/angular2';
import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/forms';

import {App} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/search-bar/search-bar';


function randomTitle() {
  var items = ['Pizza', 'Pumpkin', 'Apple', 'Bologna'];
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
    this.form = fb.group({
      searchQuery: ['', Validators.required]
    });


    this.query = 'HELLO';

    this.items = []
    for(let i = 0; i < 100; i++) {
      this.items.push({
        title: randomTitle()
      })
    }
  }

  getItems() {
    var q = this.form.controls.searchQuery.value;
    console.log('getItem', q);
    // debugger;
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
