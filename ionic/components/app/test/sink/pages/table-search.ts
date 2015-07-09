import {Component} from 'angular2/angular2';
import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {IonicView} from 'ionic/ionic';


function randomTitle() {
  var items = ['Pizza', 'Pumpkin', 'Apple', 'Bologna', 'Durian', 'Banana', 'Meat pie'];
  return items[Math.floor(Math.random() * items.length)];
}

@Component({
  selector: 'ion-view',
  appInjector: [FormBuilder]
})
@IonicView({
  template: `
  <ion-navbar *navbar><ion-title>Table Search</ion-title></ion-navbar>

  <ion-content>
    <form (^submit)="doSearch($event)" [control-group]="form">

      <ion-search-bar control="searchQuery"></ion-search-bar>

      <ion-list #list>

        <ion-item *ng-for="#item of getItems()"><!--items | search:form.controls.searchControl.value-->
          {{item.title}}
        </ion-item>
      </ion-list>
    </form>
  </ion-content>
  `
})
export class TableSearchPage {
  constructor(formBuilder: FormBuilder) {
    console.log('IonicApp Start')

    this.form = formBuilder.group({
      searchQuery: ['', Validators.required]
    });

    this.query = 'HELLO';

    this.items = [];
    for(let i = 0; i < 100; i++) {
      this.items.push({
        title: randomTitle()
      })
    }
  }

  getItems() {
    var q = this.form.controls.searchQuery.value;
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
