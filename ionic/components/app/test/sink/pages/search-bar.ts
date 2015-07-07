import {Component, Directive, View} from 'angular2/angular2';
import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {IonicApp, Segment, SegmentButton, SearchBar, List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';

import {SinkPage} from '../sink-page';

@Component({
  selector: 'ion-view',
  appInjector: [FormBuilder]
})
@View({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Search Bar</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Search Bar</h2>
    <p>
      The Search Bar is a multi-function search component.
    </p>
    <p>
      The bar can sit standalone as part of a form or header search,
      or it can also handle and display a list of search results.
    </p>

    <form (^submit)="doSubmit($event)" [ng-form-model]="form">
      <ion-search-bar placeholder="Search" ng-control="searchQuery"></ion-search-bar>
      <div>
        Query: <b>{{form.controls.searchQuery.value}}</b>
      </div>
    </form>
  </ion-content>
  `,
  directives: [formDirectives, NavbarTemplate, Navbar, Content, SearchBar]
})
export class SearchBarPage extends SinkPage {
  constructor(app: IonicApp, formBuilder: FormBuilder) {
    super(app);

    //var fb = new FormBuilder();
    this.form = formBuilder.group({
      searchQuery: ['', Validators.required]
    });
  }
}
